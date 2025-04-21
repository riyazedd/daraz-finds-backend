import Product from '../models/productModel.js';
import { cloudinary } from '../config/cloudinary.js';

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

        if (!Array.isArray(products)) {
            products = [products];
        }

        const createdProducts = [];

        for (let productData of products) {
            // Get Cloudinary info from req.file
            const image = req.file?.path || "";
            const imagePublicId = req.file?.filename || ""; // This is the crucial field

            const newProduct = await Product.create({ 
                ...productData, 
                image,
                imagePublicId 
            });
            createdProducts.push(newProduct);
        }

        res.status(201).json({ success: true, products: createdProducts });
    } catch (err) {
        console.error("Error inserting product:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let image = product.image;
        let imagePublicId = product.imagePublicId;

        if (req.file) {
            // Delete old image from Cloudinary
            if (imagePublicId) {
                await cloudinary.uploader.destroy(imagePublicId);
            }

            // Set new image details
            image = req.file.path;
            imagePublicId = req.file.filename;
        }

        await Product.findByIdAndUpdate(id, { 
            ...req.body, 
            image, 
            imagePublicId 
        });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image from Cloudinary if public ID exists
        if (product.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(product.imagePublicId);
            } catch (cloudinaryErr) {
                console.error("Cloudinary deletion error:", cloudinaryErr);
            }
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: err.message });
    }
};

export { getProducts, getProductById, addProduct, updateProduct, deleteProduct };