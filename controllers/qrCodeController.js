const QRCode = require("qrcode");

const renderQRCodePage = (req, res) => {
    res.render("qrCode", { title: "QR Code Generator" });
};
const generateQRCode = async (req, res) => {
    try {
        let { url, width, height } = req.body;
        console.log("Request body:", req.body);
        console.log("Original URL:", url);

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        // Add https:// if no protocol is specified
        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        console.log("Modified URL:", url);

        // Check if the URL is valid
        if (!isValidUrl(url)) {
            console.log("Invalid URL detected:", url);
            return res.status(400).json({ error: "Invalid URL format" });
        }

        console.log("URL is valid. Generating QR code for URL:", url);
        const qrCode = await QRCode.toBuffer(url, {
            width: parseInt(width) || 350,
            height: parseInt(height) || 350,
            margin: 1,
            scale: 8,
        });
        res.type("png").send(qrCode);
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).json({ error: "Failed to generate QR code" });
    }
};

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    renderQRCodePage,
    generateQRCode,
};
