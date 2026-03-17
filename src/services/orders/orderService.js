import { AppDataSource } from '../../config/database.js';
import { Order, OrderStatus, PaymentStatus } from '../../entities/orders/Order.js';
import { OrderItem } from '../../entities/orders/OrderItem.js';
import { Product } from '../../entities/products/Product.js';
import { User } from '../../entities/auth/User.js';
import { Payment } from '../../entities/payments/Payment.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class OrderService {
  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderItemRepository = AppDataSource.getRepository(OrderItem);
    this.productRepository = AppDataSource.getRepository(Product);
    this.userRepository = AppDataSource.getRepository(User);
    this.paymentRepository = AppDataSource.getRepository(Payment);
  }

  async createOrder(orderData, buyerId = null) {
  const { items, shippingAddress, billingAddress, notes, guestName, guestPhone, guestEmail } = orderData;

  // Verify buyer if logged in
  if (buyerId) {
    const buyer = await this.userRepository.findOne({ where: { id: buyerId } });
    if (!buyer) throw new AppError('Buyer not found', 404);
  } else {
    // Guest order - require guest info
    if (!guestName || !guestPhone) {
      throw new AppError('Guest name and phone are required', 400);
    }
  }

    // Validate and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, isActive: true }
      });

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}`, 400);
      }

      if (!product.isInStock()) {
        throw new AppError(`Product ${product.name} is out of stock`, 400);
      }

      const orderItem = this.orderItemRepository.create({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        originalPrice: product.originalPrice,
        productName: product.name,
        productImage: product.mainImage,
        productSpecifications: product.specifications
      });

      orderItem.calculateTotal();
      subtotal += orderItem.total;
      orderItems.push(orderItem);
    }

    // Create order
    const order = this.orderRepository.create({
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
      paymentStatus: PaymentStatus.PENDING
    });

    order.generateOrderNumber();
    order.calculateTotal();

    // Save order first
    const savedOrder = await this.orderRepository.save(order);

    // Save order items with order reference
    orderItems.forEach(item => {
      item.orderId = savedOrder.id;
    });
    await this.orderItemRepository.save(orderItems);

    // Update product stock
    for (const item of orderItems) {
      await this.productRepository.update(
        { id: item.productId },
        { stock: () => `stock - ${item.quantity}` }
      );
    }

    return await this.getOrderById(savedOrder.id);
  }

  async getOrderById(id) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['buyer', 'orderItems', 'orderItems.product']
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async getOrdersByUser(userId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.buyerId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getAllOrders(filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      buyerId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (buyerId) {
      queryBuilder.andWhere('order.buyerId = :buyerId', { buyerId });
    }

    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(id, status, userId) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['buyer']
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check permissions
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const canUpdate = user.role === 'admin' || order.buyerId === userId;

    if (!canUpdate) {
      throw new AppError('Unauthorized to update this order', 403);
    }

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
        await this.restoreProductStock(order.id);
        break;
    }

    return await this.orderRepository.save(order);
  }

  async updatePaymentStatus(id, paymentStatus, paymentReference) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.paymentStatus = paymentStatus;
    order.paymentReference = paymentReference;

    if (paymentStatus === PaymentStatus.PAID) {
      order.status = OrderStatus.CONFIRMED;
    }

    return await this.orderRepository.save(order);
  }

  async cancelOrder(id, userId) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['buyer']
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check permissions
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const canCancel = user.role === 'admin' || order.buyerId === userId;

    if (!canCancel) {
      throw new AppError('Unauthorized to cancel this order', 403);
    }

    if (!order.canBeCancelled()) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    // Restore product stock
    await this.restoreProductStock(order.id);

    return await this.orderRepository.save(order);
  }

  async restoreProductStock(orderId) {
    const orderItems = await this.orderItemRepository.find({
      where: { orderId }
    });

    for (const item of orderItems) {
      await this.productRepository.update(
        { id: item.productId },
        { stock: () => `stock + ${item.quantity}` }
      );
    }
  }

  async getOrderStatistics() {
    const totalOrders = await this.orderRepository.count();
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    const ordersByStatus = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
      ordersByStatus
    };
  }
  async getOrdersByArtisan(artisanId, filters = {}) {
  const { page = 1, limit = 20 } = filters;

  const queryBuilder = this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.orderItems', 'orderItems')
    .leftJoinAndSelect('orderItems.product', 'product')
    .leftJoinAndSelect('order.buyer', 'buyer')
    .where('product.artisanId = :artisanId', { artisanId });

  const offset = (page - 1) * limit;
  queryBuilder.skip(offset).take(limit).orderBy('order.createdAt', 'DESC');

  const [orders, total] = await queryBuilder.getManyAndCount();

  return {
    orders,
    pagination: { page: parseInt(page), limit: parseInt(limit), total }
  };
}
}

