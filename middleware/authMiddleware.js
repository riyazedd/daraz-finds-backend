const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

//protect routes
const protect = async (req, res, next) => {
    let token = req.cookies?.jwt; // Read from cookies
    console.log("Token from request:", token); // Debugging

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debugging

        req.user = await User.findById(decoded.userId).select("-password");
        console.log(req.user);

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

//admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'not authorized as admin' });
    }
};

module.exports = { protect, admin };