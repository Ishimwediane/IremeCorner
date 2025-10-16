import { EntitySchema } from 'typeorm';

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

export const OrderSchema = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    orderNumber: {
      type: 'varchar',
      length: 50,
      unique: true
    },
    subtotal: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    tax: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    shipping: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    discount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0
    },
    totalAmount: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    status: {
      type: 'varchar',
      length: 50,
      default: OrderStatus.PENDING
    },
    paymentStatus: {
      type: 'varchar',
      length: 50,
      default: PaymentStatus.PENDING
    },
    paymentMethod: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    paymentReference: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    shippingAddress: {
      type: 'varchar',
      length: 100
    },
    billingAddress: {
      type: 'varchar',
      length: 100
    },
    trackingNumber: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    notes: {
      type: 'text',
      nullable: true
    },
    shippedAt: {
      type: 'timestamp',
      nullable: true
    },
    deliveredAt: {
      type: 'timestamp',
      nullable: true
    },
    cancelledAt: {
      type: 'timestamp',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    },
    buyerId: {
      type: 'uuid'
    }
  },
  relations: {
    buyer: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'buyerId' }
    },
    orderItems: {
      target: 'OrderItem',
      type: 'one-to-many',
      inverseSide: 'order',
      cascade: true
    }
  }
});

export class Order {
  constructor() {
    this.id = null;
    this.orderNumber = '';
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.discount = 0;
    this.totalAmount = 0;
    this.status = OrderStatus.PENDING;
    this.paymentStatus = PaymentStatus.PENDING;
    this.paymentMethod = null;
    this.paymentReference = null;
    this.shippingAddress = '';
    this.billingAddress = '';
    this.trackingNumber = null;
    this.notes = null;
    this.shippedAt = null;
    this.deliveredAt = null;
    this.cancelledAt = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.buyerId = null;
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }

  calculateTotal() {
    this.totalAmount = this.subtotal + this.tax + this.shipping - this.discount;
  }

  canBeCancelled() {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
  }

  canBeRefunded() {
    return [OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(this.status) && 
           this.paymentStatus === PaymentStatus.PAID;
  }
}
