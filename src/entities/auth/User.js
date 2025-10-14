import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Product } from '../products/Product.js';
import { Order } from '../orders/Order.js';
import { Course } from '../courses/Course.js';
import { Enrollment } from '../courses/Enrollment.js';
import { AssignmentSubmission } from '../courses/AssignmentSubmission.js';
import { Certificate } from '../courses/Certificate.js';
import { Payment } from '../payments/Payment.js';
import { Notification } from '../notifications/Notification.js';

export const UserRole = {
  BUYER: 'buyer',
  ARTISAN: 'artisan',
  STUDENT: 'student',
  TRAINER: 'trainer',
  ADMIN: 'admin',
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100 })
  firstName;

  @Column({ type: 'varchar', length: 100 })
  lastName;

  @Column({ type: 'varchar', length: 255, unique: true })
  email;

  @Column({ type: 'varchar', length: 255 })
  password;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar;

  @Column({ type: 'enum', enum: Object.values(UserRole), default: UserRole.BUYER })
  role;

  @Column({ type: 'boolean', default: false })
  isEmailVerified;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website;

  @Column({ type: 'varchar', length: 255, nullable: true })
  socialMedia;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating;

  @Column({ type: 'int', default: 0 })
  totalReviews;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @OneToMany(() => Product, product => product.artisan)
  products;

  @OneToMany(() => Order, order => order.buyer)
  orders;

  @OneToMany(() => Course, course => course.instructor)
  courses;

  @OneToMany(() => Enrollment, enrollment => enrollment.student)
  enrollments;

  @OneToMany(() => AssignmentSubmission, submission => submission.student)
  assignmentSubmissions;

  @OneToMany(() => Certificate, certificate => certificate.student)
  certificates;

  @OneToMany(() => Payment, payment => payment.user)
  payments;

  @OneToMany(() => Notification, notification => notification.user)
  notifications;

  // Methods
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
