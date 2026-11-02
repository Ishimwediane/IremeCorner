import express from 'express';
import { AppDataSource } from '../../config/database.js';
import { Product, ProductStatus } from '../../entities/products/Product.js';
import { Order } from '../../entities/orders/Order.js';
import { ContactMessage, ContactMessageStatus } from '../../entities/contact/ContactMessage.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

const router = express.Router();

router.use(authenticateToken, requireRole('admin'));

// @route   GET /api/admin/dashboard
// @desc    Summary counts for the admin dashboard
// @access  Admin
router.get('/dashboard', asyncHandler(async (req, res) => {
  const products = AppDataSource.getRepository(Product);
  const orders = AppDataSource.getRepository(Order);
  const messages = AppDataSource.getRepository(ContactMessage);

  const [totalProducts, activeProducts, outOfStock, totalOrders, totalMessages, newMessages] = await Promise.all([
    products.count({ where: { isActive: true } }),
    products.count({ where: { isActive: true, status: ProductStatus.ACTIVE } }),
    products.count({ where: { isActive: true, status: ProductStatus.OUT_OF_STOCK } }),
    orders.count(),
    messages.count(),
    messages.count({ where: { status: ContactMessageStatus.NEW } })
  ]);

  res.json({
    success: true,
    data: { totalProducts, activeProducts, outOfStock, totalOrders, totalMessages, newMessages }
  });
}));

export default router;
