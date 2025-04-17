import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // Adjust according to your project structure

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL, // Make sure this is set in .env
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
