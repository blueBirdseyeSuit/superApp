console.log("Initial YANDEX_API_KEY:", window.YANDEX_API_KEY);
document.addEventListener("DOMContentLoaded", () => {
    const weatherForm = document.getElementById("weatherForm");
    weatherForm.addEventListener("submit", handleSubmit);

    if (typeof ymaps === "undefined") {
        console.error("Yandex Maps API not loaded");
    }
    initMap();
});

function initMap() {
    if (typeof ymaps === "undefined") {
        console.error("Yandex Maps API not loaded");
        return;
    }
    ymaps.ready(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        try {
            window.map = new ymaps.Map(mapContainer, {
                center: [55.76, 37.64], // Москва
                zoom: 10,
            });
        } catch (error) {
            console.error("Error creating map:", error);
        }
    });
}

function updateMap(lat, lon) {
    if (map) {
        map.setCenter([lat, lon], 10);
        map.geoObjects.removeAll();
        const placemark = new ymaps.Placemark([lat, lon]);
        map.geoObjects.add(placemark);
    }
}

async function fetchWeatherData(city) {
    const response = await fetch(
        `/weather/api/weather?city=${encodeURIComponent(city)}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return response.json();
}

async function fetchTimezone(lat, lon) {
    const response = await fetch(`/weather/api/timezone?lat=${lat}&lon=${lon}`);
    return await response.json();
}

async function fetchCountryInfo(countryCode) {
    const response = await fetch(
        `/weather/api/country-info?countryCode=${countryCode}`
    );
    return await response.json();
}

async function handleSubmit(event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;

    try {
        const weatherData = await fetchWeatherData(city);
        const timezoneData = await fetchTimezone(
            weatherData.coordinates.lat,
            weatherData.coordinates.lon
        );
        const countryInfo = await fetchCountryInfo(weatherData.country);
        updateData(weatherData, timezoneData, countryInfo);
        updateMap(weatherData.coordinates.lat, weatherData.coordinates.lon);
    } catch (error) {
        console.error("Error:", error);
    }
}

function updateData(weatherData, timezoneData, countryInfo) {
    const city = document.getElementById("cityInput").value;
    const cityName = document.getElementById("cityName");
    cityName.innerHTML = city;

    // Getting elements by ID...
    const cityNameDiv = document.getElementById("cityNameDiv"); // to make it visible...
    const resultDiv = document.getElementById("resultDiv"); // to make this visible too
    const countryCode = document.getElementById("countryCode");
    const flag = document.getElementById("flag");
    const weatherResult = document.getElementById("weatherResult");
    const timezoneResult = document.getElementById("timezoneResult");
    const countryResult = document.getElementById("countryResult");

    // Working with elements
    // Making blocks visible
    cityNameDiv.classList.remove("invisible");
    resultDiv.classList.remove("invisible");

    // Posting data to elements
    countryCode.innerHTML = weatherData.country;
    flag.innerHTML = `<img src=${countryInfo.flag} alt="Flag of ${countryInfo.name}" style="h-full w-full rounded-lg"></img>`;

    weatherResult.innerHTML = `
            <h2 class="font-main text-2xl text-center">Current weather</h2>
            <p><img src="${weatherData.icon}" alt="${weatherData.description}"> - ${weatherData.description}</p>
            <p>Temperature: ${weatherData.temperature} °C</p>
            <p>Feels like: ${weatherData.feels_like} °C</p>
            <p>Humidity: ${weatherData.humidity} %</p>
            <p>Pressure: ${weatherData.pressure} hPa</p>
            <p>Wind speed: ${weatherData.wind_speed} m/s</p>
            <p>Rain volume: ${weatherData.rain_volume} mm</p>
            <p>Country code: ${weatherData.country}</p>
            <p>Coordinates: (${weatherData.coordinates.lat}, ${weatherData.coordinates.lon})</p>
        `;

    timezoneResult.innerHTML = `
            <h2 class="font-main text-2xl text-center">Timezone information</h2>
            <p>Local time: ${timezoneData.cityTime}</p>
            <p>Time zone: ${timezoneData.timezone}</p>
            <p>GMT Offset: ${timezoneData.gmtOffset / 3600} hours</p>
        `;

    countryResult.innerHTML = `
            <h2 class="font-main text-2xl text-center">Country information</h2>
            <p><img src=${countryInfo.flag} alt="Flag of ${countryInfo.name}" width="100"></p>
            <p>Country: ${countryInfo.name}</p>
            <p>Region: ${countryInfo.region}</p>
            <p>Capital: ${countryInfo.capital}</p>
            <p>Currency: ${countryInfo.currency}</p>
            <p>Population in country: ${countryInfo.population}</p>
        `;
}
