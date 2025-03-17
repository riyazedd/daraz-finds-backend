import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

// Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        console.log("User ID from token:", req.user?._id); // Debugging

        const user = await User.findById(req.user._id).select("-password");
        // console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User fetched:", user); // Debugging
        res.json(user);

    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Authenticate user & set token
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            // Hash the new password before saving it
            const salt = await bcrypt.genSalt(10); // Generate salt
            user.password = await bcrypt.hash(req.body.password, salt); // Hash the password
        }

        await user.save();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { getProfile, authUser, logoutUser, updateProfile };
