import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';

export const SystemLogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

export const SystemLogCategory = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATABASE: 'database',
  API: 'api',
  PAYMENT: 'payment',
  EMAIL: 'email',
  FILE_UPLOAD: 'file_upload',
  SYSTEM: 'system',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
};

@Entity('system_logs')
@Index(['level', 'category', 'createdAt'])
@Index(['userId', 'createdAt'])
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50 })
  level;

  @Column({ type: 'varchar', length: 50 })
  category;

  @Column({ type: 'varchar', length: 200 })
  message;

  @Column({ type: 'text', nullable: true })
  details; // Additional log details

  @Column({ type: 'json', nullable: true })
  metadata; // Additional log metadata

  @Column({ type: 'varchar', length: 100, nullable: true })
  action; // Action that triggered the log

  @Column({ type: 'varchar', length: 200, nullable: true })
  resource; // Resource affected

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress;

  @Column({ type: 'text', nullable: true })
  userAgent;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sessionId;

  @Column({ type: 'boolean', default: false })
  isResolved; // For error logs

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.systemLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid', nullable: true })
  userId;

  // Methods
  markAsResolved() {
    this.isResolved = true;
    this.resolvedAt = new Date();
  }

  isError() {
    return this.level === SystemLogLevel.ERROR || this.level === SystemLogLevel.FATAL;
  }

  isWarning() {
    return this.level === SystemLogLevel.WARN;
  }

  isInfo() {
    return this.level === SystemLogLevel.INFO;
  }

  isDebug() {
    return this.level === SystemLogLevel.DEBUG;
  }

  isFatal() {
    return this.level === SystemLogLevel.FATAL;
  }

  getFormattedMessage() {
    const timestamp = this.createdAt.toISOString();
    const user = this.user ? `${this.user.email}` : 'Anonymous';
    return `[${timestamp}] ${this.level.toUpperCase()} - ${this.category}: ${this.message} (User: ${user})`;
  }
}
