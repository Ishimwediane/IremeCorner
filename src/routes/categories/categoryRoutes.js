import express from 'express';
import { Category } from '../../entities/products/Category.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all active product categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });

  res.json({
    success: true,
    data: categories
  });
}));

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.json({
    success: true,
    data: category
  });
}));

export default router;
