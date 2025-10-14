import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const PostType = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  PRODUCT_SHOWCASE: 'product_showcase',
  COURSE_ANNOUNCEMENT: 'course_announcement',
  TUTORIAL: 'tutorial',
  INSPIRATION: 'inspiration',
};

export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  HIDDEN: 'hidden',
};

@Entity('social_posts')
@Index(['authorId', 'createdAt'])
@Index(['status', 'createdAt'])
export class SocialPost {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  title;

  @Column({ type: 'text' })
  content;

  @Column({ type: 'varchar', length: 50, default: PostType.TEXT })
  type;

  @Column({ type: 'varchar', length: 50, default: PostStatus.DRAFT })
  status;

  @Column({ type: 'json', nullable: true })
  media; // Images, videos, etc.

  @Column({ type: 'json', nullable: true })
  hashtags; // Array of hashtags

  @Column({ type: 'json', nullable: true })
  mentions; // Array of mentioned users

  @Column({ type: 'int', default: 0 })
  likesCount;

  @Column({ type: 'int', default: 0 })
  commentsCount;

  @Column({ type: 'int', default: 0 })
  sharesCount;

  @Column({ type: 'int', default: 0 })
  viewsCount;

  @Column({ type: 'boolean', default: false })
  isPinned;

  @Column({ type: 'boolean', default: false })
  isFeatured;

  @Column({ type: 'json', nullable: true })
  metadata; // Additional post data

  @Column({ type: 'timestamp', nullable: true })
  publishedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.socialPosts)
  @JoinColumn({ name: 'authorId' })
  author;

  @Column({ type: 'uuid' })
  authorId;

  // For product showcase posts
  @ManyToOne(() => Product, product => product.socialPosts, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid', nullable: true })
  productId;

  // For course announcement posts
  @ManyToOne(() => Course, course => course.socialPosts, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // Methods
  publish() {
    this.status = PostStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  archive() {
    this.status = PostStatus.ARCHIVED;
  }

  hide() {
    this.status = PostStatus.HIDDEN;
  }

  pin() {
    this.isPinned = true;
  }

  unpin() {
    this.isPinned = false;
  }

  incrementLikes() {
    this.likesCount += 1;
  }

  decrementLikes() {
    this.likesCount = Math.max(0, this.likesCount - 1);
  }

  incrementComments() {
    this.commentsCount += 1;
  }

  decrementComments() {
    this.commentsCount = Math.max(0, this.commentsCount - 1);
  }

  incrementViews() {
    this.viewsCount += 1;
  }

  incrementShares() {
    this.sharesCount += 1;
  }

  isPublished() {
    return this.status === PostStatus.PUBLISHED;
  }

  getEngagementRate() {
    const totalEngagement = this.likesCount + this.commentsCount + this.sharesCount;
    return this.viewsCount > 0 ? (totalEngagement / this.viewsCount) * 100 : 0;
  }
}
