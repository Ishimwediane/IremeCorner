import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/User.js';
import { Course } from './Course.js';

export const EnrollmentStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
};

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50, default: EnrollmentStatus.ACTIVE })
  status;

  @Column({ type: 'int', default: 0 })
  progress; // percentage

  @Column({ type: 'int', default: 0 })
  currentLesson;

  @Column({ type: 'timestamp', nullable: true })
  startedAt;

  @Column({ type: 'timestamp', nullable: true })
  completedAt;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt;

  @Column({ type: 'json', nullable: true })
  completedLessons;

  @Column({ type: 'json', nullable: true })
  quizScores;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  finalGrade;

  @Column({ type: 'text', nullable: true })
  certificateUrl;

  @Column({ type: 'boolean', default: false })
  certificateIssued;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.enrollments)
  @JoinColumn({ name: 'studentId' })
  student;

  @Column({ type: 'uuid' })
  studentId;

  @ManyToOne(() => Course, course => course.courseEnrollments)
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid' })
  courseId;

  // Methods
  updateProgress(lessonIndex, totalLessons) {
    this.currentLesson = lessonIndex;
    this.progress = Math.round((lessonIndex / totalLessons) * 100);
    this.lastAccessedAt = new Date();
  }

  markLessonComplete(lessonId) {
    if (!this.completedLessons) {
      this.completedLessons = [];
    }
    if (!this.completedLessons.includes(lessonId)) {
      this.completedLessons.push(lessonId);
    }
  }

  isLessonComplete(lessonId) {
    return this.completedLessons && this.completedLessons.includes(lessonId);
  }

  completeEnrollment() {
    this.status = EnrollmentStatus.COMPLETED;
    this.progress = 100;
    this.completedAt = new Date();
  }

  canReceiveCertificate() {
    return this.status === EnrollmentStatus.COMPLETED && 
           this.progress === 100 && 
           (!this.finalGrade || this.finalGrade >= 70);
  }
}
