import express from 'express';
const router = express.Router();
import UploadMiddleware from '../middleware/UploadMiddleware.js';

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controller/productController.js';

const uploader = new UploadMiddleware();

// ✅ Apply upload middleware for image upload
router.route('/')
  .get(getProducts)
  .post(uploader.upload("products").single("image"), addProduct); // ← HERE

router.route('/:id')
  .get(getProductById)
  .put(uploader.upload("products").single("image"), updateProduct)
  .delete(deleteProduct);

export default router;
