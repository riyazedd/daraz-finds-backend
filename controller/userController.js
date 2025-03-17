import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, no user found" });
        }

        console.log("User ID from token:", req.user._id); // Debugging

        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User fetched:", user); // Debugging
        res.json(user);
    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Authenticate user & set token
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token,
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, no user found" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });

    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { getProfile, authUser, updateProfile };
