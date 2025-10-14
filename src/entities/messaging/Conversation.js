import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { Message } from './Message.js';

export const ConversationType = {
  DIRECT: 'direct',
  GROUP: 'group',
  SUPPORT: 'support',
};

export const ConversationStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  BLOCKED: 'blocked',
};

@Entity('conversations')
@Index(['participant1Id', 'participant2Id'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title; // For group conversations

  @Column({ type: 'varchar', length: 50, default: ConversationType.DIRECT })
  type;

  @Column({ type: 'varchar', length: 50, default: ConversationStatus.ACTIVE })
  status;

  @Column({ type: 'text', nullable: true })
  description; // For group conversations

  @Column({ type: 'json', nullable: true })
  metadata; // Additional conversation data

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt;

  @Column({ type: 'uuid', nullable: true })
  lastMessageId;

  @Column({ type: 'int', default: 0 })
  unreadCount1; // Unread count for participant1

  @Column({ type: 'int', default: 0 })
  unreadCount2; // Unread count for participant2

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.conversationsAsParticipant1)
  @JoinColumn({ name: 'participant1Id' })
  participant1;

  @Column({ type: 'uuid' })
  participant1Id;

  @ManyToOne(() => User, user => user.conversationsAsParticipant2)
  @JoinColumn({ name: 'participant2Id' })
  participant2;

  @Column({ type: 'uuid' })
  participant2Id;

  @OneToMany(() => Message, message => message.conversation)
  messages;

  // Methods
  getOtherParticipant(userId) {
    if (this.participant1Id === userId) {
      return this.participant2;
    } else if (this.participant2Id === userId) {
      return this.participant1;
    }
    return null;
  }

  getUnreadCount(userId) {
    if (this.participant1Id === userId) {
      return this.unreadCount1;
    } else if (this.participant2Id === userId) {
      return this.unreadCount2;
    }
    return 0;
  }

  incrementUnreadCount(userId) {
    if (this.participant1Id === userId) {
      this.unreadCount1 += 1;
    } else if (this.participant2Id === userId) {
      this.unreadCount2 += 1;
    }
  }

  resetUnreadCount(userId) {
    if (this.participant1Id === userId) {
      this.unreadCount1 = 0;
    } else if (this.participant2Id === userId) {
      this.unreadCount2 = 0;
    }
  }

  updateLastMessage(message) {
    this.lastMessageAt = message.createdAt;
    this.lastMessageId = message.id;
  }

  isActive() {
    return this.status === ConversationStatus.ACTIVE;
  }

  isArchived() {
    return this.status === ConversationStatus.ARCHIVED;
  }

  isBlocked() {
    return this.status === ConversationStatus.BLOCKED;
  }
}
