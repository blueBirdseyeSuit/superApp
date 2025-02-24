const express = require("express");
const bmiCalculator = require("../controllers/bmiController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
router.get('/', authenticateToken, (req, res) => {
    res.render('bmi', { title: 'BMI Calculator' });
  });
router.post("/calculate-bmi", authenticateToken, bmiCalculator);

module.exports = router;
