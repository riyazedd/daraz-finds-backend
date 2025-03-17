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

// Keep CORS as it is
app.use(cors({
    origin: process.env.FRONTEND_URL, // Explicitly allow your frontend origin
    credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// API Routes
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

// Serve frontend static files (Ensure correct path)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Change "dist" to "build" if using CRA

// Catch-all route to serve React frontend for non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist", "index.html")); 
});

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err.message);
    } else {
        console.log(`Server running on port: ${port}`);
    }
});
