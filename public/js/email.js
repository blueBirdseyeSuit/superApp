document.getElementById("email-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        document.getElementById("message").textContent = result.message;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("message").textContent = "Failed to send email";
    }
});
