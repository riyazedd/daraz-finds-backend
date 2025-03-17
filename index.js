const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const path = require('path');

const port = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL, // Explicitly allow your frontend origin
    credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);

// Endpoint to scrape product image
app.get('/scrape-image', async (req, res) => {
    const { url } = req.query; // Get the product URL from the query parameter

    if (!url) {
        return res.status(400).json({ error: 'Product URL is required' });
    }

    try {
        // Fetch the product page
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        // console.log(response.data);
        // Find the image URL (update the selector based on Daraz's structure)
        const imageUrl = $('img.pdp-mod-common-image').attr('src'); // Replace with the correct selector

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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
} else {
    app.get('/', (req, res) => {
        res.send('Api is running');
    });
}

// Export the app for Vercel
module.exports = app;