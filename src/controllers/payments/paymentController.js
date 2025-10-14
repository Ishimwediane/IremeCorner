import { PaymentService } from '../../services/payments/paymentService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  initiateOrderPayment = asyncHandler(async (req, res) => {
    const result = await this.paymentService.initiateOrderPayment(
      req.params.orderId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Payment initiated. Please complete payment via WhatsApp.',
      data: result
    });
  });

  initiateCoursePayment = asyncHandler(async (req, res) => {
    const result = await this.paymentService.initiateCoursePayment(
      req.params.courseId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Payment initiated. Please complete payment via WhatsApp.',
      data: result
    });
  });

  confirmPayment = asyncHandler(async (req, res) => {
    const { referenceNumber, paymentDetails } = req.body;
    const result = await this.paymentService.confirmPayment(
      req.params.paymentId,
      referenceNumber,
      paymentDetails,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: result
    });
  });

  getPaymentHistory = asyncHandler(async (req, res) => {
    const result = await this.paymentService.getPaymentHistory(req.user.id, req.query);

    res.json({
      success: true,
      data: result
    });
  });

  refundPayment = asyncHandler(async (req, res) => {
    const { refundAmount, refundReason } = req.body;
    const result = await this.paymentService.refundPayment(
      req.params.paymentId,
      refundAmount,
      refundReason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: result
    });
  });

  getPaymentStatistics = asyncHandler(async (req, res) => {
    const statistics = await this.paymentService.getPaymentStatistics();

    res.json({
      success: true,
      data: statistics
    });
  });

  getPendingPayments = asyncHandler(async (req, res) => {
    const payments = await this.paymentService.getPendingPayments();

    res.json({
      success: true,
      data: payments
    });
  });
}