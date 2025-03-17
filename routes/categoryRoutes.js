import express from 'express';
const router = express.Router();

import { getCategory, getCategoryById, addCategory, updateCategory, deleteCategory } from '../controller/categoryController.js';

router.route('/').get(getCategory);
router.route('/:id').get(getCategoryById);
router.route('/').post(addCategory);
router.route('/:id').put(updateCategory);
router.route('/:id').delete(deleteCategory);

export default router;