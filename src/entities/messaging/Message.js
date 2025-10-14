import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};

@Entity('messages')
@Index(['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'text' })
  content;

  @Column({ type: 'varchar', length: 50, default: MessageType.TEXT })
  type;

  @Column({ type: 'varchar', length: 50, default: MessageStatus.SENT })
  status;

  @Column({ type: 'json', nullable: true })
  attachments; // File attachments

  @Column({ type: 'json', nullable: true })
  metadata; // Additional message data

  @Column({ type: 'boolean', default: false })
  isEdited;

  @Column({ type: 'timestamp', nullable: true })
  editedAt;

  @Column({ type: 'boolean', default: false })
  isDeleted;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt;

  @Column({ type: 'timestamp', nullable: true })
  readAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender;

  @Column({ type: 'uuid' })
  senderId;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'receiverId' })
  receiver;

  @Column({ type: 'uuid' })
  receiverId;

  @Column({ type: 'uuid' })
  conversationId;

  // Methods
  markAsRead() {
    this.status = MessageStatus.READ;
    this.readAt = new Date();
  }

  markAsDelivered() {
    this.status = MessageStatus.DELIVERED;
  }

  edit(newContent) {
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
  }

  delete() {
    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  isRead() {
    return this.status === MessageStatus.READ;
  }

  isDelivered() {
    return this.status === MessageStatus.DELIVERED || this.status === MessageStatus.READ;
  }
}
