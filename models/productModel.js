const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_link: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;