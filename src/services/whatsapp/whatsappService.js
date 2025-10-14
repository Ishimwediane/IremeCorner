import { configs } from '../config/index.js';

export class WhatsAppService {
  static generatePaymentLink(orderNumber, amount, paymentId, transactionId) {
    const message = configs.whatsapp.messageTemplate
      .replace('{ORDER_NUMBER}', orderNumber)
      .replace('{AMOUNT}', amount)
      .replace('{PAYMENT_ID}', paymentId)
      .replace('{TRANSACTION_ID}', transactionId);

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  static generateCourseEnrollmentLink(courseTitle, amount, paymentId, transactionId) {
    const message = `Hello! I would like to enroll in the course "${courseTitle}". Payment ID: ${transactionId}. Amount: $${amount}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  static generateSupportLink(issue) {
    const message = `Hello! I need support with: ${issue}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  static generateContactLink() {
    const message = 'Hello! I would like to get in touch with IremeCorner support.';
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = configs.whatsapp.phoneNumber.replace('+', '');
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  static formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10) {
      return `+1${cleaned}`; // Default to US country code
    }
    
    return `+${cleaned}`;
  }

  static validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
}
