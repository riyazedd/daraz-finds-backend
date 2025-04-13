import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

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

// Scrape product image using Puppeteer with stealth plugin
puppeteer.use(StealthPlugin());

app.get('/scrape-image', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const decodedUrl = decodeURIComponent(url);
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(decodedUrl, { waitUntil: 'networkidle2', timeout: 100000 });

        // Try to get main product image (adjust selector based on page structure)
        await page.waitForSelector('img.pdp-mod-common-image', { timeout: 100000 });

        const imageUrl = await page.$eval('img.pdp-mod-common-image', img => img.src);

        await browser.close();

        if (!imageUrl) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ imageUrl });

    } catch (error) {
        console.error('Puppeteer scrape error:', error.message);
        res.status(500).json({ 
            error: error.message.includes('timeout') ? 'Page took too long to load or CAPTCHA appeared' : 'Failed to scrape image' 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
