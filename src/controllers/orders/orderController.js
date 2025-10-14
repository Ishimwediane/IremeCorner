import { OrderService } from '../../services/orders/orderService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = asyncHandler(async (req, res) => {
    const order = await this.orderService.createOrder(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await this.orderService.getOrderById(req.params.id);

    res.json({
      success: true,
      data: order
    });
  });

  getMyOrders = asyncHandler(async (req, res) => {
    const result = await this.orderService.getOrdersByUser(req.user.id, req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getAllOrders = asyncHandler(async (req, res) => {
    const result = await this.orderService.getAllOrders(req.query);

    res.json({
      success: true,
      data: result
    });
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await this.orderService.updateOrderStatus(
      req.params.id,
      status,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  });

  updatePaymentStatus = asyncHandler(async (req, res) => {
    const { paymentStatus, paymentReference } = req.body;
    const order = await this.orderService.updatePaymentStatus(
      req.params.id,
      paymentStatus,
      paymentReference
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const order = await this.orderService.cancelOrder(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  });

  getOrderStatistics = asyncHandler(async (req, res) => {
    const statistics = await this.orderService.getOrderStatistics();

    res.json({
      success: true,
      data: statistics
    });
  });
}
