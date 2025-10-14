import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../auth/User.js';
import { Category } from '../products/Category.js';
import { Enrollment } from './Enrollment.js';

export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const CourseLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  title;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'text', nullable: true })
  shortDescription;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice;

  @Column({ type: 'varchar', length: 50, default: CourseStatus.DRAFT })
  status;

  @Column({ type: 'varchar', length: 50, default: CourseLevel.BEGINNER })
  level;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail;

  @Column({ type: 'json', nullable: true })
  images;

  @Column({ type: 'json', nullable: true })
  videos;

  @Column({ type: 'json', nullable: true })
  documents;

  @Column({ type: 'json', nullable: true })
  curriculum;

  @Column({ type: 'int', default: 0 })
  duration; // in minutes

  @Column({ type: 'int', default: 0 })
  lessons;

  @Column({ type: 'int', default: 0 })
  enrollments;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating;

  @Column({ type: 'int', default: 0 })
  reviewCount;

  @Column({ type: 'json', nullable: true })
  requirements;

  @Column({ type: 'json', nullable: true })
  learningOutcomes;

  @Column({ type: 'json', nullable: true })
  tags;

  @Column({ type: 'varchar', length: 200, nullable: true })
  slug;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'boolean', default: false })
  isFeatured;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.courses)
  @JoinColumn({ name: 'instructorId' })
  instructor;

  @Column({ type: 'uuid' })
  instructorId;

  @ManyToOne(() => Category, category => category.courses)
  @JoinColumn({ name: 'categoryId' })
  category;

  @Column({ type: 'uuid' })
  categoryId;

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  courseEnrollments;

  // Methods
  getDiscountPercentage() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }

  updateRating(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  }

  incrementEnrollments() {
    this.enrollments += 1;
  }

  getFormattedDuration() {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }
}
