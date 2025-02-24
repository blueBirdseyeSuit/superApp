const express = require("express");
const router = express.Router();
const {
    sendEmail,
    renderEmailForm,
} = require("../controllers/emailController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, renderEmailForm);
router.post("/send", authenticateToken, sendEmail);

module.exports = router;
