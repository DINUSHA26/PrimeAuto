import Category from '../models/Category.js';
import SparePart from '../models/SparePart.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const categoryExists = await Category.findOne({ name: name.toLowerCase() });
        if (categoryExists) {
            // If it exists but is inactive, reactivate it?
            if (!categoryExists.isActive) {
                categoryExists.isActive = true;
                categoryExists.description = description || categoryExists.description;
                await categoryExists.save();
                return res.status(201).json({
                    success: true,
                    message: 'Category reactivated',
                    data: categoryExists
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        const category = await Category.create({
            name: name.toLowerCase(),
            description
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if any products use this category
        const productsCount = await SparePart.countDocuments({ category: category.name });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It contains ${productsCount} products.`
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};
