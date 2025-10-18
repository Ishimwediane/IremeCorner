import express from 'express';
import { PaymentController } from '../../controllers/payments/paymentController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { paymentLimiter } from '../../middleware/rateLimit/rateLimit.js';
import {
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const paymentController = new PaymentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - paymentMethod
 *         - amount
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [card, paypal, bank_transfer]
 *           description: Payment method
 *           example: card
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Payment amount
 *           example: 99.99
 *         currency:
 *           type: string
 *           default: USD
 *           description: Currency code
 *           example: USD
 *     
 *     PaymentConfirmation:
 *       type: object
 *       required:
 *         - transactionId
 *         - status
 *       properties:
 *         transactionId:
 *           type: string
 *           description: External transaction ID
 *           example: txn_123456789
 *         status:
 *           type: string
 *           enum: [success, failed, pending]
 *           description: Payment status
 *           example: success
 *         gatewayResponse:
 *           type: object
 *           description: Payment gateway response data
 *     
 *     RefundRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: Refund reason
 *           example: Customer requested refund
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Refund amount (optional, defaults to full amount)
 */

// Protected routes
router.use(authenticateToken);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   post:
 *     summary: Initiate order payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment initiated successfully
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
 *                   example: Payment initiated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         orderId:
 *                           type: string
 *                           format: uuid
 *                         amount:
 *                           type: number
 *                         status:
 *                           type: string
 *                         paymentUrl:
 *                           type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post('/order/:orderId', paymentLimiter, validateUUID, paymentController.initiateOrderPayment);

/**
 * @swagger
 * /payments/course/{courseId}:
 *   post:
 *     summary: Initiate course payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.post('/course/:courseId', paymentLimiter, validateUUID, paymentController.initiateCoursePayment);

/**
 * @swagger
 * /payments/{paymentId}/confirm:
 *   post:
 *     summary: Confirm payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentConfirmation'
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/:paymentId/confirm', validateUUID, paymentController.confirmPayment);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
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
 *           enum: [pending, paid, failed, refunded]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/history', validatePagination, paymentController.getPaymentHistory);

/**
 * @swagger
 * /payments/{paymentId}/refund:
 *   post:
 *     summary: Request payment refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefundRequest'
 *     responses:
 *       200:
 *         description: Refund request submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/:paymentId/refund', validateUUID, paymentController.refundPayment);

/**
 * @swagger
 * /payments/statistics:
 *   get:
 *     summary: Get payment statistics (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment statistics retrieved successfully
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
 *                     totalPayments:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     paymentsByStatus:
 *                       type: object
 *                     monthlyStats:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/statistics', requireRole('admin'), paymentController.getPaymentStatistics);

/**
 * @swagger
 * /payments/pending:
 *   get:
 *     summary: Get pending payments (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/pending', requireRole('admin'), paymentController.getPendingPayments);

export default router;