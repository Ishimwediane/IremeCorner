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

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Product name
 *           example: Wireless Headphones
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Product description
 *           example: High-quality wireless headphones with noise cancellation
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Product price
 *           example: 99.99
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Available stock
 *           example: 50
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *           example: ["electronics", "audio", "wireless"]
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 */
router.get('/', validatePagination, productController.getProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured products retrieved successfully
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /products/popular:
 *   get:
 *     summary: Get popular products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Popular products retrieved successfully
 */
router.get('/popular', productController.getPopularProducts);

/**
 * @swagger
 * /products/new:
 *   get:
 *     summary: Get new products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: New products retrieved successfully
 */
router.get('/new', productController.getNewProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', validateUUID, productController.getProductById);

// Protected routes
router.use(authenticateToken);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Artisan only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Artisan role required
 */
router.post('/', requireRole('artisan'), uploadProductImages, validateProductCreation, productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (Artisan only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Artisan role required
 *       404:
 *         description: Product not found
 */
router.put('/:id', validateUUID, uploadProductImages, validateProductUpdate, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (Artisan only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Artisan role required
 *       404:
 *         description: Product not found
 */
router.delete('/:id', validateUUID, productController.deleteProduct);
router.get('/artisan/:artisanId?', productController.getProductsByArtisan);

// Admin routes - Full product management
router.post('/admin', requireRole('admin'), uploadProductImages, validateProductCreation, productController.createProduct);
router.put('/admin/:id', requireRole('admin'), validateUUID, uploadProductImages, validateProductUpdate, productController.updateProduct);
router.delete('/admin/:id', requireRole('admin'), validateUUID, productController.deleteProduct);
router.get('/admin/all', requireRole('admin'), validatePagination, productController.getAllProductsAdmin);
router.put('/admin/:id/rating', requireRole('admin'), validateUUID, productController.updateProductRating);
router.put('/admin/:id/status', requireRole('admin'), validateUUID, productController.updateProductStatus);

export default router;




