import express from 'express';
const router = express.Router();
import { getProfile, authUser, logoutUser, updateProfile } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);
router.put('/editprofile', protect, updateProfile);

export default router;