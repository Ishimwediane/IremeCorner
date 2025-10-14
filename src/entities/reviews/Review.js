import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const ReviewType = {
  PRODUCT: 'product',
  COURSE: 'course',
  ARTISAN: 'artisan',
  TRAINER: 'trainer',
};

export const ReviewStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  HIDDEN: 'hidden',
};

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'int', default: 5 })
  rating; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment;

  @Column({ type: 'varchar', length: 50 })
  type; // product, course, artisan, trainer

  @Column({ type: 'varchar', length: 50, default: ReviewStatus.PENDING })
  status;

  @Column({ type: 'boolean', default: false })
  isVerified; // Verified purchase/enrollment

  @Column({ type: 'json', nullable: true })
  images; // Review images

  @Column({ type: 'json', nullable: true })
  metadata; // Additional review data

  @Column({ type: 'int', default: 0 })
  helpfulCount; // How many found this helpful

  @Column({ type: 'int', default: 0 })
  reportCount; // How many reported this review

  @Column({ type: 'boolean', default: true })
  isActive;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'reviewerId' })
  reviewer;

  @Column({ type: 'uuid' })
  reviewerId;

  // For product reviews
  @ManyToOne(() => Product, product => product.reviews, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid', nullable: true })
  productId;

  // For course reviews
  @ManyToOne(() => Course, course => course.reviews, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // For artisan/trainer reviews
  @ManyToOne(() => User, user => user.receivedReviews, { nullable: true })
  @JoinColumn({ name: 'reviewedUserId' })
  reviewedUser;

  @Column({ type: 'uuid', nullable: true })
  reviewedUserId;

  // Methods
  markAsHelpful() {
    this.helpfulCount += 1;
  }

  reportReview() {
    this.reportCount += 1;
  }

  approve() {
    this.status = ReviewStatus.APPROVED;
  }

  reject() {
    this.status = ReviewStatus.REJECTED;
  }

  hide() {
    this.status = ReviewStatus.HIDDEN;
  }

  isApproved() {
    return this.status === ReviewStatus.APPROVED;
  }

  getRatingStars() {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
  }
}
