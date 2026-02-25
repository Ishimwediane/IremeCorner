import express from 'express';
const router = express.Router();

// Hardcoded categories (use these UUIDs that match your database)
const CATEGORIES = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Basket",
    description: "Handmade baskets",
    type: "product",
    isActive: true,
    createdAt: "2025-12-04T12:39:23.975Z",
    updatedAt: "2025-12-04T12:39:23.975Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Wall Arts",
    description: "Decorative wall arts",
    type: "product",
    isActive: true,
    createdAt: "2025-12-04T12:39:23.975Z",
    updatedAt: "2025-12-04T12:39:23.975Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Pottery",
    description: "Clay pottery items",
    type: "product",
    isActive: true,
    createdAt: "2025-12-04T12:39:23.975Z",
    updatedAt: "2025-12-04T12:39:23.975Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Others",
    description: "Other artisan products",
    type: "product",
    isActive: true,
    createdAt: "2025-12-04T12:39:23.975Z",
    updatedAt: "2025-12-04T12:39:23.975Z"
  }
];

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: CATEGORIES
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const category = CATEGORIES.find(cat => cat.id === req.params.id);
    
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
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;