import express from 'express';
const router = express.Router();

import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controller/productController.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/').post(addProduct);
router.route('/:id').put(updateProduct);
router.route('/:id').delete(deleteProduct);

export default router;