import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

//protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("No token found in cookies or headers"); // Debugging
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        console.log("Token received:", token); // Debugging

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debugging

        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            console.log("User not found in DB"); // Debugging
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
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

export { protect, admin };