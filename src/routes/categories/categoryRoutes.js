import express from 'express';
import { AppDataSource } from '../../config/database.js';
import { Category, CategoryType } from '../../entities/products/Category.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const categoryRepository = () => AppDataSource.getRepository(Category);

// @route   GET /api/categories
// @desc    Get all active product categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await categoryRepository().find({
    where: { type: CategoryType.PRODUCT, isActive: true },
    order: { sortOrder: 'ASC', name: 'ASC' }
  });

  res.json({
    success: true,
    data: categories
  });
}));

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', validateUUID, asyncHandler(async (req, res) => {
  const category = await categoryRepository().findOne({ where: { id: req.params.id } });

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
