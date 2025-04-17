import Product from '../models/productModel.js';

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
            let image = "";

            // Handle image if file is uploaded
            if (req.file) {
                image = req.file.filename;
            }

            const newProduct = await Product.create({ ...productData, image });
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

        if (req.file) {
            image = req.file.filename;
        }

        await Product.findByIdAndUpdate(id, { ...req.body, image });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({ success: false, message: err.message });
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

export { getProducts, getProductById, addProduct, updateProduct, deleteProduct };