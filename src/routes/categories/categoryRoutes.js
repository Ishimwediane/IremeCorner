import express from 'express';
import { AppDataSource } from '../../config/database.js';
import { CategorySchema, CategoryType } from '../../entities/products/Category.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateCategoryCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('type')
    .isIn(['product', 'course'])
    .withMessage('Type must be either "product" or "course"'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(CategorySchema);
  const { type } = req.query;
  
  const where = type ? { type } : {};
  const categories = await categoryRepository.find({
    where,
    order: { name: 'ASC' }
  });

  res.json({
    success: true,
    data: categories
  });
}));

// Get category by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(CategorySchema);
  const category = await categoryRepository.findOne({
    where: { id: req.params.id }
  });

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

// Create category (Admin only)
router.post('/', authenticateToken, requireRole('admin'), validateCategoryCreation, asyncHandler(async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(CategorySchema);
  
  const { name, description, type } = req.body;
  
  // Check if category already exists
  const existingCategory = await categoryRepository.findOne({
    where: { name, type }
  });
  
  if (existingCategory) {
    return res.status(409).json({
      success: false,
      message: 'Category with this name and type already exists'
    });
  }
  
  const category = categoryRepository.create({
    name,
    description,
    type
  });
  
  const savedCategory = await categoryRepository.save(category);
  
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: savedCategory
  });
}));

// Update category (Admin only)
router.put('/:id', authenticateToken, requireRole('admin'), asyncHandler(async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(CategorySchema);
  
  const category = await categoryRepository.findOne({
    where: { id: req.params.id }
  });
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  const { name, description, type } = req.body;
  
  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (type) category.type = type;
  
  const updatedCategory = await categoryRepository.save(category);
  
  res.json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory
  });
}));

// Delete category (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), asyncHandler(async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(CategorySchema);
  
  const category = await categoryRepository.findOne({
    where: { id: req.params.id }
  });
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  await categoryRepository.remove(category);
  
  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
}));

export default router;


