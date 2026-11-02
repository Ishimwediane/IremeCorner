import mongoose from 'mongoose';
import { uuidId, baseSchemaOptions, subSchemaOptions } from '../schemaOptions.js';

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Order items are stored inside their order, with a snapshot of the product at purchase time.
const orderItemSchema = new mongoose.Schema({
  _id: uuidId,
  productId: { type: String, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  total: { type: Number, required: true },
  productName: { type: String, required: true, maxlength: 200 },
  productImage: { type: String, maxlength: 500, default: null },
  productSpecifications: { type: mongoose.Schema.Types.Mixed, default: null },
}, subSchemaOptions);

orderItemSchema.virtual('product', { ref: 'Product', localField: 'productId', foreignField: '_id', justOne: true });

const orderSchema = new mongoose.Schema({
  _id: uuidId,
  orderNumber: { type: String, required: true, unique: true, maxlength: 50 },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  paymentMethod: { type: String, maxlength: 100, default: null },
  paymentReference: { type: String, maxlength: 255, default: null },
  shippingAddress: { type: String, required: true, maxlength: 500 },
  billingAddress: { type: String, required: true, maxlength: 500 },
  trackingNumber: { type: String, maxlength: 100, default: null },
  notes: { type: String, default: null },
  shippedAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  buyerId: { type: String, ref: 'User', default: null, index: true },
  guestName: { type: String, maxlength: 100, default: null },
  guestPhone: { type: String, maxlength: 20, default: null },
  guestEmail: { type: String, maxlength: 100, default: null },
  orderItems: { type: [orderItemSchema], default: [] },
}, baseSchemaOptions);

orderSchema.index({ 'orderItems.productId': 1 });

orderSchema.virtual('buyer', { ref: 'User', localField: 'buyerId', foreignField: '_id', justOne: true });

orderSchema.methods.generateOrderNumber = function generateOrderNumber() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
};

orderSchema.methods.calculateTotal = function calculateTotal() {
  this.totalAmount = this.subtotal + this.tax + this.shipping - this.discount;
};

orderSchema.methods.canBeCancelled = function canBeCancelled() {
  return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
};

orderSchema.methods.canBeRefunded = function canBeRefunded() {
  return [OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(this.status) &&
         this.paymentStatus === PaymentStatus.PAID;
};

export const Order = mongoose.model('Order', orderSchema);
