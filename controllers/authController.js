const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            // MongoDB error for duplicate keys
            return res.status(409).json({ error: "Username already exists" });
        }
        console.error("Error while registering user:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Login attempt for user:", username);
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found:", username);
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password for user:", username);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Login successful for user:", username);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });
        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            error: "Server error during login",
            details: error.message,
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

exports.checkAuth = (req, res) => {
    if (req.user) {
        res.json({
            isAuthenticated: true,
            username: req.user.username,
            role: req.user.role,
        });
    } else {
        res.json({ isAuthenticated: false });
    }
};
