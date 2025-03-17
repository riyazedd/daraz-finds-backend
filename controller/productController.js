const Product = require('../models/productModel.js');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    }

    res.status(404).json({ message: "Product not found" });
};

const addProduct = async (req, res) => {
    try {
        let products = req.body;

        console.log("Incoming product data:", products); // Debugging log

        if (!products || (Array.isArray(products) && products.length === 0)) {
            return res.status(400).json({ success: false, message: "No product data provided" });
        }

        if (!Array.isArray(products)) {
            products = [products];
        }

        const createdProducts = await Product.insertMany(products);

        res.status(201).json({ success: true, products: createdProducts });
    } catch (err) {
        console.error("Error inserting product:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        await Product.findByIdAndUpdate(id, req.body);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };