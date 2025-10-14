import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const AnalyticsEventType = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  COURSE_VIEW: 'course_view',
  SEARCH: 'search',
  CLICK: 'click',
  CONVERSION: 'conversion',
  PURCHASE: 'purchase',
  ENROLLMENT: 'enrollment',
  DOWNLOAD: 'download',
  SHARE: 'share',
  LIKE: 'like',
  REVIEW: 'review',
};

export const AnalyticsCategory = {
  USER_BEHAVIOR: 'user_behavior',
  SALES: 'sales',
  CONTENT: 'content',
  ENGAGEMENT: 'engagement',
  PERFORMANCE: 'performance',
};

@Entity('analytics_events')
@Index(['eventType', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['category', 'createdAt'])
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50 })
  eventType;

  @Column({ type: 'varchar', length: 50 })
  category;

  @Column({ type: 'varchar', length: 200 })
  eventName;

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ type: 'json', nullable: true })
  properties; // Event-specific properties

  @Column({ type: 'json', nullable: true })
  metadata; // Additional event data

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress;

  @Column({ type: 'text', nullable: true })
  userAgent;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referrer;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sessionId;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value; // Monetary value for conversions

  @Column({ type: 'int', default: 1 })
  count; // Event count

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.analyticsEvents, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid', nullable: true })
  userId;

  @ManyToOne(() => Product, product => product.analyticsEvents, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid', nullable: true })
  productId;

  @ManyToOne(() => Course, course => course.analyticsEvents, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // Methods
  isConversion() {
    return this.eventType === AnalyticsEventType.CONVERSION;
  }

  isPurchase() {
    return this.eventType === AnalyticsEventType.PURCHASE;
  }

  isEnrollment() {
    return this.eventType === AnalyticsEventType.ENROLLMENT;
  }

  hasValue() {
    return this.value && this.value > 0;
  }

  getFormattedValue() {
    return this.value ? `$${this.value.toFixed(2)}` : null;
  }
}
