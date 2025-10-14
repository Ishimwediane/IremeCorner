import { AppDataSource } from '../../config/database.js';
import { Payment, PaymentMethod, PaymentStatus, PaymentType } from '../../entities/payments/Payment.js';
import { Order } from '../../entities/orders/Order.js';
import { Course } from '../../entities/courses/Course.js';
import { User } from '../../entities/auth/User.js';
import { configs } from '../../config/index.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class PaymentService {
  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.orderRepository = AppDataSource.getRepository(Order);
    this.courseRepository = AppDataSource.getRepository(Course);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async initiateOrderPayment(orderId, userId) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['buyer']
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.buyerId !== userId) {
      throw new AppError('Unauthorized to pay for this order', 403);
    }

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      throw new AppError('Order already paid', 400);
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      userId,
      orderId,
      amount: order.totalAmount,
      currency: 'USD',
      method: PaymentMethod.WHATSAPP,
      type: PaymentType.ORDER,
      status: PaymentStatus.PENDING
    });

    payment.generateTransactionId();
    const savedPayment = await this.paymentRepository.save(payment);

    // Generate WhatsApp payment link
    const whatsappLink = this.generateWhatsAppLink(order, savedPayment);

    return {
      paymentId: savedPayment.id,
      transactionId: payment.transactionId,
      whatsappLink,
      amount: order.totalAmount,
      orderNumber: order.orderNumber
    };
  }

  async initiateCoursePayment(courseId, userId) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, isActive: true }
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if already enrolled
    const enrollmentRepository = AppDataSource.getRepository('Enrollment');
    const existingEnrollment = await enrollmentRepository.findOne({
      where: { courseId, studentId: userId }
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 409);
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      userId,
      courseId,
      amount: course.price,
      currency: 'USD',
      method: PaymentMethod.WHATSAPP,
      type: PaymentType.COURSE,
      status: PaymentStatus.PENDING
    });

    payment.generateTransactionId();
    const savedPayment = await this.paymentRepository.save(payment);

    // Generate WhatsApp payment link
    const whatsappLink = this.generateWhatsAppLinkForCourse(course, savedPayment);

    return {
      paymentId: savedPayment.id,
      transactionId: payment.transactionId,
      whatsappLink,
      amount: course.price,
      courseTitle: course.title
    };
  }

  generateWhatsAppLink(order, payment) {
    const message = configs.whatsapp.messageTemplate
      .replace('{ORDER_NUMBER}', order.orderNumber)
      .replace('{AMOUNT}', order.totalAmount)
      .replace('{PAYMENT_ID}', payment.id)
      .replace('{TRANSACTION_ID}', payment.transactionId);

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  generateWhatsAppLinkForCourse(course, payment) {
    const message = `Hello! I would like to enroll in the course "${course.title}". Payment ID: ${payment.transactionId}. Amount: $${course.price}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  async confirmPayment(paymentId, referenceNumber, paymentDetails, userId) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, userId }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new AppError('Payment already completed', 400);
    }

    // Update payment record
    payment.markAsCompleted(referenceNumber, paymentDetails);
    await this.paymentRepository.save(payment);

    // Update related order or course
    if (payment.orderId) {
      const order = await this.orderRepository.findOne({ where: { id: payment.orderId } });
      if (order) {
        order.paymentStatus = PaymentStatus.COMPLETED;
        order.status = 'confirmed';
        order.paymentId = payment.transactionId;
        await this.orderRepository.save(order);
      }
    }

    if (payment.courseId) {
      // Create enrollment
      const enrollmentRepository = AppDataSource.getRepository('Enrollment');
      const enrollment = enrollmentRepository.create({
        courseId: payment.courseId,
        studentId: userId,
        status: 'active',
        startedAt: new Date(),
        lastAccessedAt: new Date()
      });
      await enrollmentRepository.save(enrollment);

      // Increment course enrollment count
      const course = await this.courseRepository.findOne({ where: { id: payment.courseId } });
      if (course) {
        course.incrementEnrollments();
        await this.courseRepository.save(course);
      }
    }

    return {
      success: true,
      paymentId: payment.id,
      transactionId: payment.transactionId
    };
  }

  async getPaymentHistory(userId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('payment.course', 'course')
      .where('payment.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('payment.type = :type', { type });
    }

    queryBuilder.orderBy(`payment.${sortBy}`, sortOrder);

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [payments, total] = await queryBuilder.getManyAndCount();

    return {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async refundPayment(paymentId, refundAmount, refundReason, userId) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, userId }
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (!payment.isRefundable()) {
      throw new AppError('Payment is not refundable', 400);
    }

    payment.processRefund(refundAmount || payment.amount, refundReason);
    await this.paymentRepository.save(payment);

    return {
      success: true,
      refundAmount: refundAmount || payment.amount,
      refundReason
    };
  }

  async getPaymentStatistics() {
    const totalPayments = await this.paymentRepository.count();
    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .getRawOne();

    const paymentsByStatus = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.status')
      .getRawMany();

    const paymentsByMethod = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.method', 'method')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.method')
      .getRawMany();

    return {
      totalPayments,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
      paymentsByStatus,
      paymentsByMethod
    };
  }

  async getPendingPayments() {
    return await this.paymentRepository.find({
      where: { status: PaymentStatus.PENDING },
      relations: ['user', 'order', 'course'],
      order: { createdAt: 'DESC' }
    });
  }
}