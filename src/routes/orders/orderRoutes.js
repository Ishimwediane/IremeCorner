import express from 'express';
import { OrderController } from '../../controllers/orders/orderController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import {
  validateOrderCreation,
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const orderController = new OrderController();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity ordered
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Price per unit
 *     
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *         - zipCode
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           description: Street address
 *           example: 123 Main Street
 *         city:
 *           type: string
 *           description: City
 *           example: New York
 *         state:
 *           type: string
 *           description: State/Province
 *           example: NY
 *         zipCode:
 *           type: string
 *           description: ZIP/Postal code
 *           example: 10001
 *         country:
 *           type: string
 *           description: Country
 *           example: United States
 *     
 *     OrderRequest:
 *       type: object
 *       required:
 *         - items
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Order items
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *           enum: [card, paypal, bank_transfer]
 *           description: Payment method
 *           example: card
 *     
 *     OrderStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *           description: New order status
 *           example: confirmed
 *     
 *     PaymentStatusUpdate:
 *       type: object
 *       required:
 *         - paymentStatus
 *       properties:
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *           description: New payment status
 *           example: paid
 */

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: Order created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateOrderCreation, orderController.createOrder);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/my-orders', validatePagination, orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', validateUUID, orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order cannot be cancelled
 */
router.put('/:id/cancel', validateUUID, orderController.cancelOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/', requireRole('admin'), validatePagination, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', requireRole('admin'), validateUUID, orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/payment-status:
 *   put:
 *     summary: Update payment status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatusUpdate'
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Order not found
 */
router.put('/:id/payment-status', requireRole('admin'), validateUUID, orderController.updatePaymentStatus);

/**
 * @swagger
 * /orders/statistics:
 *   get:
 *     summary: Get order statistics (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
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
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     ordersByStatus:
 *                       type: object
 *                     monthlyStats:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/statistics', requireRole('admin'), orderController.getOrderStatistics);

export default router;






