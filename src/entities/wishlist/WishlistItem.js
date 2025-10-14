import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const WishlistItemType = {
  PRODUCT: 'product',
  COURSE: 'course',
};

@Entity('wishlist_items')
@Unique(['userId', 'productId', 'courseId'])
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50 })
  type; // product or course

  @Column({ type: 'varchar', length: 500, nullable: true })
  notes; // User's personal notes about the item

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'json', nullable: true })
  metadata; // Additional data like price when added, etc.

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.wishlistItems)
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid' })
  userId;

  // For product wishlist items
  @ManyToOne(() => Product, product => product.wishlistItems, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid', nullable: true })
  productId;

  // For course wishlist items
  @ManyToOne(() => Course, course => course.wishlistItems, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // Methods
  getItemDetails() {
    if (this.type === WishlistItemType.PRODUCT && this.product) {
      return {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.mainImage,
        type: 'product'
      };
    } else if (this.type === WishlistItemType.COURSE && this.course) {
      return {
        id: this.course.id,
        name: this.course.title,
        price: this.course.price,
        image: this.course.thumbnail,
        type: 'course'
      };
    }
    return null;
  }

  isProduct() {
    return this.type === WishlistItemType.PRODUCT;
  }

  isCourse() {
    return this.type === WishlistItemType.COURSE;
  }
}
