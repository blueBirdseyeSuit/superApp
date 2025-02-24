const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getAdminPanel = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.render("admin", { title: "Admin panel", users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.length < 2) {
            return res
                .status(400)
                .json({
                    message: "Search query must be at least 2 characters long",
                });
        }
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null },
            ],
        });
        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Error searching users" });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || "user",
        });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }
        res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, password } = req.body;
        const updateData = { username, role };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message,
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
