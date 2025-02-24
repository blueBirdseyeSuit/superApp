const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }
        req.user = {
            userId: user._id,
            username: user.username,
            role: user.role
        };
        next();
    } catch (error) {
        console.error('Error in authenticateToken:', error);
        res.redirect('/auth/login');
    }
};

module.exports = authenticateToken;