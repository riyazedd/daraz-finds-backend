import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer'; // Use Puppeteer's executable path for Render deployment
import axios from 'axios';
import cheerio from 'cheerio';
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

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);

// Puppeteer setup with Stealth plugin
puppeteer.use(StealthPlugin());

app.get('/scrape-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Decode and clean up the URL
        const decodedUrl = decodeURIComponent(url);

        // Launch Puppeteer with custom executable path for Render
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: executablePath(), // Use the local Chromium path installed by Puppeteer
        });

        const page = await browser.newPage();

        // Set User-Agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.setViewport({ width: 1366, height: 768 });

        // Navigate to the product page
        await page.goto(decodedUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the product image to load and scrape its URL
        await page.waitForSelector('img.pdp-mod-common-image', { timeout: 10000 });

        const imageUrl = await page.$eval('img.pdp-mod-common-image', img => img.src);

        await browser.close();

        if (!imageUrl) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ imageUrl });

    } catch (error) {
        console.error('Puppeteer scrape error:', error.message);
        res.status(500).json({
            error: error.message.includes('timeout') ? 'Page timeout or CAPTCHA detected' : error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
