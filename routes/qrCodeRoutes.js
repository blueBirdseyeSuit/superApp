const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { renderQRCodePage, generateQRCode} = require("../controllers/qrCodeController");

router.get("/", authenticateToken, renderQRCodePage);

router.post("/generate-qr", authenticateToken, generateQRCode);

module.exports = router;
