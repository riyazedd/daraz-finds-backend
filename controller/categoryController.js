import Category from '../models/categoryModel.js';

const getCategory = async (req, res) => {
    const category = await Category.find({});
    res.json(category);
};

const getCategoryById = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        return res.json(category);
    }
    res.status(404).json({ message: "Category not found" });
};

const addCategory = async (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ success: false, message: "Invalid input format" });
        }

        await Category.insertMany(req.body);
        res.status(200).json({ success: true, message: "Category Added!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        await Category.findByIdAndUpdate(id, req.body);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        let id = req.params.id;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { getCategory, getCategoryById, addCategory, updateCategory, deleteCategory };