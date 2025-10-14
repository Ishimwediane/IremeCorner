import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/User.js';
import { Order } from '../orders/Order.js';
import { Course } from '../courses/Course.js';

export const PaymentMethod = {
  WHATSAPP: 'whatsapp',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PaymentType = {
  ORDER: 'order',
  COURSE: 'course',
  SUBSCRIPTION: 'subscription',
};

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100, unique: true })
  transactionId;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency;

  @Column({ type: 'varchar', length: 50 })
  method;

  @Column({ type: 'varchar', length: 50, default: PaymentStatus.PENDING })
  status;

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceNumber;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentDetails;

  @Column({ type: 'text', nullable: true })
  failureReason;

  @Column({ type: 'timestamp', nullable: true })
  processedAt;

  @Column({ type: 'timestamp', nullable: true })
  failedAt;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount;

  @Column({ type: 'text', nullable: true })
  refundReason;

  @Column({ type: 'json', nullable: true })
  metadata;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid' })
  userId;

  @ManyToOne(() => Order, order => null, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order;

  @Column({ type: 'uuid', nullable: true })
  orderId;

  @ManyToOne(() => Course, course => null, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // Methods
  generateTransactionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    this.transactionId = `TXN-${timestamp}-${random}`.toUpperCase();
  }

  markAsCompleted(referenceNumber, paymentDetails) {
    this.status = PaymentStatus.COMPLETED;
    this.referenceNumber = referenceNumber;
    this.paymentDetails = paymentDetails;
    this.processedAt = new Date();
  }

  markAsFailed(failureReason) {
    this.status = PaymentStatus.FAILED;
    this.failureReason = failureReason;
    this.failedAt = new Date();
  }

  processRefund(refundAmount, refundReason) {
    this.status = PaymentStatus.REFUNDED;
    this.refundAmount = refundAmount;
    this.refundReason = refundReason;
    this.refundedAt = new Date();
  }

  isRefundable() {
    return this.status === PaymentStatus.COMPLETED && 
           !this.refundedAt && 
           (Date.now() - this.processedAt.getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 days
  }
}
