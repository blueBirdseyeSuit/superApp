module.exports = function bmiCalculator(req, res) {
    try {
        const weight = parseFloat(req.body.weight);
        const height = parseFloat(req.body.height);

        if (isNaN(weight) || weight <= 0) {
            return res.status(401).json({ message: "Incorrect weight" });
        }
        if (isNaN(height) || height <= 0) {
            return res.status(401).json({ message: "Incorrect height" });
        }

        console.log(
            `Calculating BMI for weight: ${weight} kg and height: ${height} m`
        );

        const bmi = weight / (height * height);
        let category = "";
        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 24.9) {
            category = "Normal";
        } else if (bmi < 29.9) {
            category = "Overweight";
        } else {
            category = "Obese";
        }

        res.json({ bmi, category });
    } catch (error) {
        console.error("Error calculating BMI:", error);
        return res
            .status(500)
            .json({ message: "Server error during BMI calculation" });
    }
};
