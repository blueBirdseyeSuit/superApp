const express = require("express");
const { register, login, logout, checkAuth } = require("../controllers/authController.js");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/login", (req, res) => {
    res.render("login", { title: "Login", layout: false });
});
router.get("/register", (req, res) => {
    res.render("register", { title: "Register", layout: false });
});
router.get("/check", authenticateToken, checkAuth);
router.post("/logout", logout);
module.exports = router;
