import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import cheerio from 'cheerio';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Fix for "__dirname is not defined in ES module scope"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve frontend static files (Ensure correct path)
app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Change to "/frontend/build" if using CRA

// Catch-all route to serve React frontend for non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
