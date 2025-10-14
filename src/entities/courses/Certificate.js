import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course.js';
import { User } from '../auth/User.js';

export const CertificateStatus = {
  ISSUED: 'issued',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
};

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50, unique: true })
  certificateNumber;

  @Column({ type: 'varchar', length: 200 })
  courseName;

  @Column({ type: 'varchar', length: 200 })
  studentName;

  @Column({ type: 'enum', enum: Object.values(CertificateStatus), default: CertificateStatus.ISSUED })
  status;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt;

  @Column({ type: 'text', nullable: true })
  verificationCode;

  @Column({ type: 'json', nullable: true })
  metadata; // Additional certificate data

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Course, course => course.certificates)
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid' })
  courseId;

  @ManyToOne(() => User, user => user.certificates)
  @JoinColumn({ name: 'studentId' })
  student;

  @Column({ type: 'uuid' })
  studentId;

  // Methods
  generateCertificateNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.certificateNumber = `CERT-${year}-${random}`;
  }

  generateVerificationCode() {
    this.verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  isExpired() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
  }

  isValid() {
    return this.status === CertificateStatus.ISSUED && !this.isExpired();
  }

  revoke() {
    this.status = CertificateStatus.REVOKED;
    this.revokedAt = new Date();
  }
}
