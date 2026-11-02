import { Order, OrderStatus, PaymentStatus } from '../../entities/orders/Order.js';
import { Product } from '../../entities/products/Product.js';
import { User, UserRole, PUBLIC_USER_FIELDS } from '../../entities/auth/User.js';
import { AppError } from '../../middleware/error/errorHandler.js';

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'totalAmount', 'status', 'orderNumber'];

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  return { [field]: String(sortOrder).toUpperCase() === 'ASC' ? 1 : -1 };
};

const paginate = (page, limit) => {
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.max(parseInt(limit) || 20, 1);
  return { pageNumber, pageSize, skip: (pageNumber - 1) * pageSize };
};

const withRelations = (query) => query
  .populate({ path: 'buyer', select: PUBLIC_USER_FIELDS })
  .populate('orderItems.product');

export class OrderService {
  async createOrder(orderData, buyerId = null) {
    const { items, shippingAddress, billingAddress, notes, guestName, guestPhone, guestEmail } = orderData;

    // Verify buyer if logged in
    if (buyerId) {
      const buyer = await User.exists({ _id: buyerId });
      if (!buyer) throw new AppError('Buyer not found', 404);
    } else if (!guestName || !guestPhone) {
      // Guest order - require guest info
      throw new AppError('Guest name and phone are required', 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('An order needs at least one item', 400);
    }

    // Validate and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = parseInt(item.quantity);
      const product = await Product.findOne({ _id: item.productId, isActive: true });

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new AppError(`Invalid quantity for product ${product.name}`, 400);
      }

      if (product.stock < quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}`, 400);
      }

      if (!product.isInStock()) {
        throw new AppError(`Product ${product.name} is out of stock`, 400);
      }

      const total = product.price * quantity;
      subtotal += total;
      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
        originalPrice: product.originalPrice,
        total,
        productName: product.name,
        productImage: product.mainImage,
        productSpecifications: product.specifications
      });
    }

    // Reserve stock atomically so two buyers cannot take the last item; undo on any failure.
    const reserved = [];
    try {
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        );
        if (!updated) {
          throw new AppError(`Insufficient stock for product ${item.productName}`, 400);
        }
        reserved.push(item);
      }

      const order = new Order({
        buyerId,
        guestName: guestName || null,
        guestPhone: guestPhone || null,
        guestEmail: guestEmail || null,
        subtotal,
        totalAmount: subtotal, // Will be updated with tax, shipping, discount
        shippingAddress,
        billingAddress,
        notes,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        orderItems
      });

      order.generateOrderNumber();
      order.calculateTotal();
      await order.save();

      return await this.getOrderById(order.id);
    } catch (error) {
      await this.adjustStock(reserved, 1);
      throw error;
    }
  }

  async adjustStock(items, direction) {
    for (const item of items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: direction * item.quantity } });
    }
  }

  async getOrderById(id) {
    const order = await withRelations(Order.findById(id));

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async listOrders(query, filters) {
    const { page, limit, sortBy, sortOrder } = filters;
    const { pageNumber, pageSize, skip } = paginate(page, limit);

    const [orders, total] = await Promise.all([
      withRelations(Order.find(query).sort(buildSort(sortBy, sortOrder)).skip(skip).limit(pageSize)),
      Order.countDocuments(query)
    ]);

    return {
      orders,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }

  async getOrdersByUser(userId, filters = {}) {
    const query = { buyerId: userId };
    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;

    return this.listOrders(query, filters);
  }

  async getAllOrders(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.buyerId) query.buyerId = filters.buyerId;

    return this.listOrders(query, filters);
  }

  async assertCanChange(order, userId, action) {
    if (order.buyerId === userId) return;
    const isAdmin = await User.exists({ _id: userId, role: UserRole.ADMIN });
    if (!isAdmin) {
      throw new AppError(`Unauthorized to ${action} this order`, 403);
    }
  }

  async updateOrderStatus(id, status, userId) {
    const order = await Order.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check permissions
    await this.assertCanChange(order, userId, 'update');

    // Validate status transition
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new AppError(`Invalid status transition from ${order.status} to ${status}`, 400);
    }

    order.status = status;

    // Set timestamps based on status
    switch (status) {
      case OrderStatus.SHIPPED:
        order.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        order.cancelledAt = new Date();
        // Restore product stock
        await this.adjustStock(order.orderItems, 1);
        break;
    }

    return await order.save();
  }

  async updatePaymentStatus(id, paymentStatus, paymentReference) {
    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.paymentStatus = paymentStatus;
    order.paymentReference = paymentReference;

    if (paymentStatus === PaymentStatus.PAID) {
      order.status = OrderStatus.CONFIRMED;
    }

    return await order.save();
  }

  async cancelOrder(id, userId) {
    const order = await Order.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check permissions
    await this.assertCanChange(order, userId, 'cancel');

    if (!order.canBeCancelled()) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    // Restore product stock
    await this.adjustStock(order.orderItems, 1);

    return await order.save();
  }

  async getOrderStatistics() {
    const [totalOrders, revenue, ordersByStatus] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: PaymentStatus.PAID } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } }
      ])
    ]);

    return {
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      ordersByStatus
    };
  }

  async getOrdersByArtisan(artisanId, filters = {}) {
    const productIds = await Product.find({ artisanId }).distinct('_id');
    const result = await this.listOrders({ 'orderItems.productId': { $in: productIds } }, filters);
    return { orders: result.orders, pagination: result.pagination };
  }
}
