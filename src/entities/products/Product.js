import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../auth/User.js';
import { Category } from './Category.js';
import { OrderItem } from '../orders/OrderItem.js';

export const ProductStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
};

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  name;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice;

  @Column({ type: 'int', default: 0 })
  stock;

  @Column({ type: 'varchar', length: 50, default: ProductStatus.DRAFT })
  status;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mainImage;

  @Column({ type: 'json', nullable: true })
  images;

  @Column({ type: 'json', nullable: true })
  tags;

  @Column({ type: 'varchar', length: 100, nullable: true })
  material;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dimensions;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weight;

  @Column({ type: 'varchar', length: 100, nullable: true })
  color;

  @Column({ type: 'varchar', length: 100, nullable: true })
  style;

  @Column({ type: 'int', default: 0 })
  views;

  @Column({ type: 'int', default: 0 })
  sales;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating;

  @Column({ type: 'int', default: 0 })
  reviewCount;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'varchar', length: 200, nullable: true })
  slug;

  @Column({ type: 'json', nullable: true })
  specifications;

  @Column({ type: 'varchar', length: 500, nullable: true })
  careInstructions;

  @Column({ type: 'varchar', length: 500, nullable: true })
  shippingInfo;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'artisanId' })
  artisan;

  @Column({ type: 'uuid' })
  artisanId;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category;

  @Column({ type: 'uuid' })
  categoryId;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems;

  // Methods
  getDiscountPercentage() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }

  isInStock() {
    return this.stock > 0 && this.status === ProductStatus.ACTIVE;
  }

  updateRating(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  }
}
