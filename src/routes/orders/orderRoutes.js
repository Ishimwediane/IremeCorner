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


// Guest route - no auth needed
router.post('/', orderController.createOrder);


// User routes
// All routes require authentication
router.use(authenticateToken);
router.post('/', validateOrderCreation, orderController.createOrder);
router.get('/my-orders', validatePagination, orderController.getMyOrders);
router.get('/artisan-orders', authenticateToken, requireRole('artisan'), orderController.getArtisanOrders);
router.get('/:id', validateUUID, orderController.getOrderById);
router.put('/:id/cancel', validateUUID, orderController.cancelOrder);


// Admin routes
router.get('/', requireRole('admin'), validatePagination, orderController.getAllOrders);
router.put('/:id/status', requireRole('admin'), validateUUID, orderController.updateOrderStatus);
router.put('/:id/payment-status', requireRole('admin'), validateUUID, orderController.updatePaymentStatus);
router.get('/statistics', requireRole('admin'), orderController.getOrderStatistics);

export default router;
