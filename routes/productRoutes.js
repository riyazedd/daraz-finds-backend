const express = require("express");
const router = express.Router();

const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require("../controller/productController.js");

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/').post(addProduct);
router.route('/:id').put(updateProduct);
router.route('/:id').delete(deleteProduct);

module.exports = router;