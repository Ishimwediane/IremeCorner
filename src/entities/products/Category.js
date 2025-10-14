import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../auth/User.js';
import { Product } from '../products/Product.js';
import { Course } from '../courses/Course.js';

export const CategoryType = {
  PRODUCT: 'product',
  COURSE: 'course',
};

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100 })
  name;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image;

  @Column({ type: 'enum', enum: Object.values(CategoryType) })
  type;

  @Column({ type: 'varchar', length: 50, nullable: true })
  slug;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'int', default: 0 })
  sortOrder;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @OneToMany(() => Product, product => product.category)
  products;

  @OneToMany(() => Course, course => course.category)
  courses;
}
