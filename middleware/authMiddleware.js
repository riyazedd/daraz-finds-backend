import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

//protect routes
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // Extract token from headers
    } 
    // Check if token exists in cookies
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // If no token, return unauthorized error
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
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

export { protect, admin };