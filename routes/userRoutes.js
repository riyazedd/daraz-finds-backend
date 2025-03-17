const express = require("express");
const router = express.Router();
const { getProfile, authUser, logoutUser, updateProfile } = require("../controller/userController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);
router.put('/editprofile', protect, updateProfile);

module.exports = router;