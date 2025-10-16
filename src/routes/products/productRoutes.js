import express from 'express';
import { ProductController } from '../../controllers/products/productController.js';
import { authenticateToken, requireRole, optionalAuth } from '../../middleware/auth/auth.js';
import { uploadProductImages } from '../../services/fileUpload/fileUploadService.js';
import {
  validateProductCreation,
  validateProductUpdate,
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const productController = new ProductController();

// Public routes
router.get('/', validatePagination, productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/new', productController.getNewProducts);
router.get('/:id', validateUUID, productController.getProductById);

// Protected routes
router.use(authenticateToken);

// Artisan routes
router.post('/', requireRole('artisan'), uploadProductImages, validateProductCreation, productController.createProduct);
router.put('/:id', validateUUID, uploadProductImages, validateProductUpdate, productController.updateProduct);
router.delete('/:id', validateUUID, productController.deleteProduct);
router.get('/artisan/:artisanId?', productController.getProductsByArtisan);

// Admin routes
router.put('/:id/rating', requireRole('admin'), validateUUID, productController.updateProductRating);

export default router;




