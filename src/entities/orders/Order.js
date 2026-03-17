import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../auth/User.js';
import { OrderItem } from './OrderItem.js';

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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount;

  @Column({ type: 'varchar', length: 50, default: OrderStatus.PENDING })
  status;

  @Column({ type: 'varchar', length: 50, default: PaymentStatus.PENDING })
  paymentStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference;

  @Column({ type: 'varchar', length: 100 })
  shippingAddress;

  @Column({ type: 'varchar', length: 100 })
  billingAddress;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber;

  @Column({ type: 'text', nullable: true })
  notes;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'buyerId' })
  buyer;

  @Column({ type: 'uuid', nullable: true  })
  buyerId;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  orderItems;
  @Column({ type: 'varchar', length: 100, nullable: true })
guestName;

@Column({ type: 'varchar', length: 20, nullable: true })
guestPhone;

@Column({ type: 'varchar', length: 100, nullable: true })
guestEmail;

  // Methods
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
