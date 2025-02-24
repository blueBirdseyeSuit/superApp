let showErrors;
import("./common.js")
    .then((module) => {
        showErrors = module.showErrors;
    })
    .catch((error) => {
        console.error("Error importing showErrors:", error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bmi-form");
    const bmiResult = document.getElementById("bmiResult");
    const category = document.getElementById("category");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);

        // Clear previous results
        bmiResult.textContent = "";
        category.textContent = "";

        // Input validation
        let errors = [];
        if (isNaN(weight) || weight <= 0) {
            errors.push("Please enter a valid positive number for weight.");
        }
        if (isNaN(height) || height <= 0) {
            errors.push("Please enter a valid positive number for height.");
        }

        if (errors.length > 0) {
            showErrors(errors, { containerId: "error-message" });
            return;
        }

        try {
            const response = await fetch("/bmi/calculate-bmi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ weight, height }),
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "An error occurred");
            }

            const data = await response.json();
            bmiResult.textContent = `BMI: ${data.bmi.toFixed(2)}`;
            category.textContent = `Category: ${data.category}`;
            document.getElementById("error-message").style.display = "none"; // Hide error message on success
        } catch (error) {
            console.error("Error:", error);
            showErrors(
                [
                    error.message ||
                        "An unexpected error occurred. Please try again.",
                ],
                { containerId: "error-message" }
            );
        }
    });
});
