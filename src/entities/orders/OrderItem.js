import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order.js';
import { Product } from '../products/Product.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'int' })
  quantity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total;

  @Column({ type: 'varchar', length: 200 })
  productName;

  @Column({ type: 'varchar', length: 500, nullable: true })
  productImage;

  @Column({ type: 'json', nullable: true })
  productSpecifications;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order;

  @Column({ type: 'uuid' })
  orderId;

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product;

  @Column({ type: 'uuid' })
  productId;

  // Methods
  calculateTotal() {
    this.total = this.price * this.quantity;
  }

  getDiscountAmount() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return (this.originalPrice - this.price) * this.quantity;
    }
    return 0;
  }
}
