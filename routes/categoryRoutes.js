const express = require('express');
const router = express.Router();

const { getCategory, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controller/categoryController.js');

router.route('/').get(getCategory);
router.route('/:id').get(getCategoryById);
router.route('/').post(addCategory);
router.route('/:id').put(updateCategory);
router.route('/:id').delete(deleteCategory);

module.exports = router;