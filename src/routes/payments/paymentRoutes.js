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

// Protected routes
router.use(authenticateToken);

// User routes
router.post('/order/:orderId', paymentLimiter, validateUUID, paymentController.initiateOrderPayment);
router.post('/course/:courseId', paymentLimiter, validateUUID, paymentController.initiateCoursePayment);
router.post('/:paymentId/confirm', validateUUID, paymentController.confirmPayment);
router.get('/history', validatePagination, paymentController.getPaymentHistory);
router.post('/:paymentId/refund', validateUUID, paymentController.refundPayment);

// Admin routes
router.get('/statistics', requireRole('admin'), paymentController.getPaymentStatistics);
router.get('/pending', requireRole('admin'), paymentController.getPendingPayments);

export default router;