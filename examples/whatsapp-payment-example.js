// Example usage of WhatsApp Payment System

import { PaymentService } from './src/services/payments/paymentService.js';

const paymentService = new PaymentService();

// Example: Customer wants to pay for an order
async function initiateOrderPayment(orderId, userId) {
  try {
    const result = await paymentService.initiateOrderPayment(orderId, userId);
    
    console.log('Payment initiated successfully!');
    console.log('WhatsApp Link:', result.whatsappLink);
    console.log('Amount:', result.amount);
    console.log('Order Number:', result.orderNumber);
    
    // In a real application, you would redirect the user to the WhatsApp link
    // window.open(result.whatsappLink, '_blank');
    
    return result;
  } catch (error) {
    console.error('Payment initiation failed:', error.message);
    throw error;
  }
}

// Example: Customer wants to enroll in a course
async function initiateCoursePayment(courseId, userId) {
  try {
    const result = await paymentService.initiateCoursePayment(courseId, userId);
    
    console.log('Course payment initiated successfully!');
    console.log('WhatsApp Link:', result.whatsappLink);
    console.log('Course:', result.courseTitle);
    console.log('Amount:', result.amount);
    
    return result;
  } catch (error) {
    console.error('Course payment initiation failed:', error.message);
    throw error;
  }
}

// Example: Admin confirms a payment
async function confirmPayment(paymentId, referenceNumber, paymentDetails, userId) {
  try {
    const result = await paymentService.confirmPayment(
      paymentId, 
      referenceNumber, 
      paymentDetails, 
      userId
    );
    
    console.log('Payment confirmed successfully!');
    console.log('Transaction ID:', result.transactionId);
    
    return result;
  } catch (error) {
    console.error('Payment confirmation failed:', error.message);
    throw error;
  }
}

// Example: Get pending payments for admin review
async function getPendingPayments() {
  try {
    const payments = await paymentService.getPendingPayments();
    
    console.log('Pending payments:', payments.length);
    payments.forEach(payment => {
      console.log(`- Payment ID: ${payment.id}`);
      console.log(`  Transaction ID: ${payment.transactionId}`);
      console.log(`  Amount: $${payment.amount}`);
      console.log(`  Type: ${payment.type}`);
      console.log(`  Created: ${payment.createdAt}`);
      console.log('---');
    });
    
    return payments;
  } catch (error) {
    console.error('Failed to get pending payments:', error.message);
    throw error;
  }
}

export {
  initiateOrderPayment,
  initiateCoursePayment,
  confirmPayment,
  getPendingPayments
};



