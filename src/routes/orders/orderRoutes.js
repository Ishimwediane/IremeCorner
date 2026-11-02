import express from 'express';
import { OrderController } from '../../controllers/orders/orderController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import {
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const orderController = new OrderController();

// Guest checkout - no auth needed
router.post('/', orderController.createOrder);

// All routes below require authentication
router.use(authenticateToken);

router.get('/my-orders', validatePagination, orderController.getMyOrders);
router.get('/artisan-orders', requireRole('artisan'), orderController.getArtisanOrders);

// Admin routes (fixed paths are declared before /:id so they are reachable)
router.get('/statistics', requireRole('admin'), orderController.getOrderStatistics);
router.get('/', requireRole('admin'), validatePagination, orderController.getAllOrders);
router.get('/:id', requireRole('admin'), validateUUID, orderController.getOrderById);
router.put('/:id/status', requireRole('admin'), validateUUID, orderController.updateOrderStatus);
router.put('/:id/payment-status', requireRole('admin'), validateUUID, orderController.updatePaymentStatus);

router.put('/:id/cancel', validateUUID, orderController.cancelOrder);

export default router;
