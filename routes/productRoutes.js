import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controller/productController.js';

const router = express.Router();
const upload = multer({ storage });

// Apply `upload.single('image')` middleware for routes accepting images
router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;
