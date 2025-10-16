# WhatsApp Payment Integration

## Overview

IremeCorner uses WhatsApp for payment processing instead of traditional payment gateways. This approach provides a more personal touch and is suitable for small to medium businesses.

## How It Works

1. **Payment Initiation**: When a user wants to pay for an order or course, the system generates a WhatsApp link with pre-filled payment details.

2. **WhatsApp Communication**: Users click the link to open WhatsApp with a pre-written message containing:
   - Order/Course details
   - Payment amount
   - Transaction ID
   - Payment reference

3. **Manual Confirmation**: Business owners manually confirm payments through WhatsApp and update the system.

4. **System Update**: Admins can confirm payments through the API to update order/course status.

## API Endpoints

### Initiate Order Payment
```http
POST /api/payments/order/:orderId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated. Please complete payment via WhatsApp.",
  "data": {
    "paymentId": "uuid",
    "transactionId": "TXN-xxx",
    "whatsappLink": "https://wa.me/1234567890?text=...",
    "amount": 99.99,
    "orderNumber": "ORD-xxx"
  }
}
```

### Initiate Course Payment
```http
POST /api/payments/course/:courseId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated. Please complete payment via WhatsApp.",
  "data": {
    "paymentId": "uuid",
    "transactionId": "TXN-xxx",
    "whatsappLink": "https://wa.me/1234567890?text=...",
    "amount": 149.99,
    "courseTitle": "Jewelry Making Basics"
  }
}
```

### Confirm Payment
```http
POST /api/payments/:paymentId/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "referenceNumber": "REF123456",
  "paymentDetails": "Payment received via bank transfer"
}
```

### Get Pending Payments (Admin)
```http
GET /api/payments/pending
Authorization: Bearer <admin-token>
```

## Configuration

### Environment Variables

```env
# WhatsApp Configuration
WHATSAPP_PHONE_NUMBER=+1234567890
WHATSAPP_MESSAGE_TEMPLATE=Hello! I would like to make a payment for order {ORDER_NUMBER}. Amount: ${AMOUNT}
```

### Message Template Variables

- `{ORDER_NUMBER}`: Order number
- `{AMOUNT}`: Payment amount
- `{PAYMENT_ID}`: Internal payment ID
- `{TRANSACTION_ID}`: Transaction reference

## Payment Methods Supported

- **WhatsApp**: Primary method for payment initiation
- **Bank Transfer**: Manual confirmation
- **Mobile Money**: Manual confirmation
- **Cash**: Manual confirmation

## Admin Workflow

1. **Monitor Pending Payments**: Use `/api/payments/pending` to see all pending payments
2. **Receive WhatsApp Message**: Customer sends payment details via WhatsApp
3. **Verify Payment**: Confirm payment was received through bank/mobile money
4. **Update System**: Use `/api/payments/:paymentId/confirm` to mark payment as completed
5. **System Updates**: Order status automatically changes to "confirmed" or course enrollment is activated

## Benefits

- **No Transaction Fees**: No payment gateway fees
- **Personal Touch**: Direct communication with customers
- **Flexible**: Supports various payment methods
- **Simple Setup**: No complex payment gateway integration
- **Local Support**: Works well in regions where digital payments are less common

## Security Considerations

- All payment confirmations require admin authentication
- Payment references are logged for audit trails
- Transaction IDs provide unique tracking
- Manual verification prevents fraudulent confirmations

## Future Enhancements

- WhatsApp Business API integration for automated responses
- Payment status tracking through WhatsApp
- Automated payment confirmation via webhook
- Integration with local payment providers




