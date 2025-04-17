import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    product_link: {
        type: String,
        required: true
    },
    image: {
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

productSchema.methods.toJSON = function () {
    var obj = this.toObject();
    if (obj.image) {
        obj.image = process.env.PUBLIC_URL+ "/products/" + obj.image;
    } else {
        obj.image = process.env.PUBLIC_URL + "/icons/notFound.png"
    }

    return obj;
}


const Product = mongoose.model("Product", productSchema);

export default Product;