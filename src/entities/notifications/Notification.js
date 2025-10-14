import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/User.js';

export const NotificationType = {
  ORDER: 'order',
  PAYMENT: 'payment',
  COURSE: 'course',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
};

export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  title;

  @Column({ type: 'text' })
  message;

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 50, default: NotificationPriority.MEDIUM })
  priority;

  @Column({ type: 'boolean', default: false })
  isRead;

  @Column({ type: 'boolean', default: false })
  isEmailSent;

  @Column({ type: 'boolean', default: false })
  isPushSent;

  @Column({ type: 'varchar', length: 500, nullable: true })
  actionUrl;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl;

  @Column({ type: 'json', nullable: true })
  metadata;

  @Column({ type: 'timestamp', nullable: true })
  readAt;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid' })
  userId;

  // Methods
  markAsRead() {
    this.isRead = true;
    this.readAt = new Date();
  }

  markAsUnread() {
    this.isRead = false;
    this.readAt = null;
  }

  isScheduled() {
    return this.scheduledAt && this.scheduledAt > new Date();
  }

  canBeSent() {
    return !this.isScheduled() && !this.isEmailSent;
  }
}
