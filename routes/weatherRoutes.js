const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, weatherController.renderWeatherPage);
router.get('/api/weather', authenticateToken, weatherController.getWeather);
router.get('/api/timezone', authenticateToken, weatherController.getTimezone);
router.get('/api/country-info', authenticateToken, weatherController.getCountryInfo);

module.exports = router;