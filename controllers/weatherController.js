const axios = require("axios");
const axiosRetry = require("axios-retry").default;

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`Retry attempt #${retryCount}`);
        return retryCount * 1000;
    },
    retryCondition: (error) => {
        return error.response?.status >= 500 || error.code === "ECONNABORTED";
    },
});

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY;
const TIMEZONE_API_URL = "http://api.timezonedb.com/v2.1/get-time-zone";
const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/alpha";

exports.renderWeatherPage = (req, res) => {
    res.render("weather", {
        title: "Weather App",
        YANDEX_API_KEY: process.env.YANDEX_API_KEY,
        layout: "./layout",
    });
};

exports.getWeather = async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City parameter required" });
    }

    try {
        const response = await axios.get(OPENWEATHER_URL, {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: "metric",
            },
        });

        const weatherData = response.data;
        res.json({
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
            coordinates: {
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon,
            },
            feels_like: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            wind_speed: weatherData.wind.speed,
            country: weatherData.sys.country,
            rain_volume: weatherData.rain ? weatherData.rain["3h"] || 0 : 0,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};

exports.getTimezone = async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude parameters are required" });
    }

    try {
        const response = await axios.get(TIMEZONE_API_URL, {
            params: {
                key: TIMEZONE_API_KEY,
                format: "json",
                by: "position",
                lat: lat,
                lng: lon,
            },
        });

        const timezoneData = response.data;
        res.json({
            cityTime: timezoneData.formatted,
            timezone: timezoneData.zoneName,
            gmtOffset: timezoneData.gmtOffset,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch timezone data" });
    }
};

exports.getCountryInfo = async (req, res) => {
    const countryCode = req.query.countryCode;
    if (!countryCode) {
        return res.status(400).json({ error: "Country parameter required" });
    }

    try {
        const response = await axios.get(
            `${REST_COUNTRIES_URL}/${countryCode}`
        );
        const countryData = response.data[0];

        res.json({
            name: countryData.name.common,
            capital: countryData.capital ? countryData.capital[0] : "N/A",
            region: countryData.region,
            currency: countryData.currencies
                ? Object.values(countryData.currencies)[0].name
                : "N/A",
            population: countryData.population,
            flag: countryData.flags ? countryData.flags.svg : "",
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch country data" });
    }
};
