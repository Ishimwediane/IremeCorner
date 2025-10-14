import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const PromotionType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping',
  BUY_X_GET_Y: 'buy_x_get_y',
  BULK_DISCOUNT: 'bulk_discount',
};

export const PromotionStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

export const PromotionTarget = {
  ALL_PRODUCTS: 'all_products',
  SPECIFIC_PRODUCTS: 'specific_products',
  ALL_COURSES: 'all_courses',
  SPECIFIC_COURSES: 'specific_courses',
  ALL_USERS: 'all_users',
  SPECIFIC_USERS: 'specific_users',
  NEW_USERS: 'new_users',
};

@Entity('promotions')
@Index(['code'])
@Index(['status', 'startDate', 'endDate'])
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100 })
  name;

  @Column({ type: 'varchar', length: 50, unique: true })
  code; // Coupon code

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 50, default: PromotionStatus.DRAFT })
  status;

  @Column({ type: 'varchar', length: 50 })
  target; // What the promotion applies to

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue; // Percentage or fixed amount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumOrderAmount; // Minimum order to use promotion

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscountAmount; // Maximum discount cap

  @Column({ type: 'int', nullable: true })
  usageLimit; // Total usage limit

  @Column({ type: 'int', default: 0 })
  usageCount; // Current usage count

  @Column({ type: 'int', nullable: true })
  usageLimitPerUser; // Usage limit per user

  @Column({ type: 'timestamp' })
  startDate;

  @Column({ type: 'timestamp' })
  endDate;

  @Column({ type: 'json', nullable: true })
  conditions; // Additional conditions

  @Column({ type: 'json', nullable: true })
  metadata; // Additional promotion data

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'boolean', default: false })
  isPublic; // Whether it's publicly visible

  @Column({ type: 'varchar', length: 500, nullable: true })
  bannerImage;

  @Column({ type: 'varchar', length: 500, nullable: true })
  termsAndConditions;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.createdPromotions)
  @JoinColumn({ name: 'createdById' })
  createdBy;

  @Column({ type: 'uuid' })
  createdById;

  // Methods
  isValid() {
    const now = new Date();
    return this.status === PromotionStatus.ACTIVE &&
           this.isActive &&
           now >= this.startDate &&
           now <= this.endDate &&
           (this.usageLimit === null || this.usageCount < this.usageLimit);
  }

  canBeUsedByUser(userId) {
    // Check if user has reached their usage limit
    if (this.usageLimitPerUser) {
      // This would need to be checked against actual usage records
      return true; // Simplified for now
    }
    return true;
  }

  calculateDiscount(orderAmount) {
    if (!this.isValid()) return 0;

    let discount = 0;

    switch (this.type) {
      case PromotionType.PERCENTAGE:
        discount = (orderAmount * this.discountValue) / 100;
        break;
      case PromotionType.FIXED_AMOUNT:
        discount = this.discountValue;
        break;
      case PromotionType.FREE_SHIPPING:
        // This would be handled differently in the shipping calculation
        discount = 0;
        break;
      default:
        discount = 0;
    }

    // Apply maximum discount cap
    if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
      discount = this.maximumDiscountAmount;
    }

    // Ensure discount doesn't exceed order amount
    return Math.min(discount, orderAmount);
  }

  incrementUsage() {
    this.usageCount += 1;
  }

  isExpired() {
    return new Date() > this.endDate;
  }

  isActiveNow() {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }

  activate() {
    this.status = PromotionStatus.ACTIVE;
  }

  pause() {
    this.status = PromotionStatus.PAUSED;
  }

  cancel() {
    this.status = PromotionStatus.CANCELLED;
  }

  expire() {
    this.status = PromotionStatus.EXPIRED;
  }
}
