let showErrors;
import("./common.js")
    .then((module) => {
        showErrors = module.showErrors;
    })
    .catch((error) => {
        console.error("Error importing showErrors:", error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("error-message");
    const form = document.getElementById("qr-form");
    const qrCodeContainer = document.getElementById("qrCodeContainer");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const url = document.getElementById("urlInput").value;
        console.log("Submitting URL:", url);

        try {
            const response = await fetch("/qr/generate-qr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, width: 350, height: 350 }),
                credentials: "include",
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const blob = await response.blob();
                const imgUrl = URL.createObjectURL(blob);
                errorMessage.textContent = "";
                qrCodeContainer.innerHTML = `<img src="${imgUrl}" alt="QR Code" width="350" height="350">`;
                console.log("QR code image set to container");
            } else {
                qrCodeContainer.innerHTML = "";
                const errorText = await response.text();
                console.error("Server error:", errorText);
                showErrors(["Failed to generate QR Code"], {
                    containerId: errorMessage.id,
                });
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
            showErrors(["Error generating QR code. Please try again."], {
                containerId: errorMessage.id,
            });
        }
    });
});
