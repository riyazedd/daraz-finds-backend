import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;


// CORS Middleware (Keeps Your Existing CORS Config)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);

// Endpoint to scrape product image
app.get('/scrape-image', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Product URL is required' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const imageUrl = $('img.pdp-mod-common-image').attr('src');

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Error scraping image:', error);
        res.status(500).json({ error: 'Failed to scrape image' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
