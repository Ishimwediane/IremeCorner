import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const StoreStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
};

export const StoreType = {
  ARTISAN: 'artisan',
  TRAINER: 'trainer',
  HYBRID: 'hybrid', // Both products and courses
};

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  name;

  @Column({ type: 'varchar', length: 200, unique: true })
  slug; // URL-friendly store name

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo;

  @Column({ type: 'varchar', length: 500, nullable: true })
  banner;

  @Column({ type: 'varchar', length: 50, default: StoreStatus.DRAFT })
  status;

  @Column({ type: 'varchar', length: 50, default: StoreType.ARTISAN })
  type;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website;

  @Column({ type: 'varchar', length: 500, nullable: true })
  socialMedia; // JSON array of social media links

  @Column({ type: 'varchar', length: 200, nullable: true })
  location;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email;

  @Column({ type: 'json', nullable: true })
  businessHours; // Store operating hours

  @Column({ type: 'json', nullable: true })
  policies; // Store policies (shipping, returns, etc.)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating;

  @Column({ type: 'int', default: 0 })
  reviewCount;

  @Column({ type: 'int', default: 0 })
  totalSales;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue;

  @Column({ type: 'int', default: 0 })
  totalProducts;

  @Column({ type: 'int', default: 0 })
  totalCourses;

  @Column({ type: 'int', default: 0 })
  totalCustomers;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'boolean', default: false })
  isVerified;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.stores)
  @JoinColumn({ name: 'ownerId' })
  owner;

  @Column({ type: 'uuid' })
  ownerId;

  @OneToMany(() => Product, product => product.store)
  products;

  @OneToMany(() => Course, course => course.store)
  courses;

  // Methods
  getDisplayName() {
    return this.name || `${this.owner?.firstName} ${this.owner?.lastName}'s Store`;
  }

  getStoreUrl() {
    return `/stores/${this.slug}`;
  }

  updateStats() {
    this.totalProducts = this.products ? this.products.length : 0;
    this.totalCourses = this.courses ? this.courses.length : 0;
    this.lastActiveAt = new Date();
  }

  calculateRating() {
    if (this.reviewCount === 0) return 0;
    // This would typically be calculated from actual reviews
    return this.rating;
  }

  isActive() {
    return this.status === StoreStatus.ACTIVE && this.isActive;
  }

  isSuspended() {
    return this.status === StoreStatus.SUSPENDED;
  }

  isClosed() {
    return this.status === StoreStatus.CLOSED;
  }

  verify() {
    this.isVerified = true;
    this.verifiedAt = new Date();
  }

  suspend() {
    this.status = StoreStatus.SUSPENDED;
  }

  activate() {
    this.status = StoreStatus.ACTIVE;
  }

  close() {
    this.status = StoreStatus.CLOSED;
  }
}
