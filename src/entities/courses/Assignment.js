import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from './Course.js';
import { AssignmentSubmission } from './AssignmentSubmission.js';

export const AssignmentType = {
  PROJECT: 'project',
  QUIZ: 'quiz',
  ESSAY: 'essay',
  PRESENTATION: 'presentation',
};

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  title;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'text', nullable: true })
  instructions;

  @Column({ type: 'timestamp' })
  dueDate;

  @Column({ type: 'int', default: 100 })
  maxPoints;

  @Column({ type: 'enum', enum: Object.values(AssignmentType), default: AssignmentType.PROJECT })
  type;

  @Column({ type: 'json', nullable: true })
  questions; // For quiz assignments

  @Column({ type: 'json', nullable: true })
  attachments; // File attachments

  @Column({ type: 'boolean', default: true })
  isActive;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Course, course => course.assignments)
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid' })
  courseId;

  @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
  submissions;

  // Methods
  isOverdue() {
    return new Date() > new Date(this.dueDate);
  }

  getSubmissionCount() {
    return this.submissions ? this.submissions.length : 0;
  }

  getAverageScore() {
    if (!this.submissions || this.submissions.length === 0) return 0;
    
    const gradedSubmissions = this.submissions.filter(s => s.score !== null);
    if (gradedSubmissions.length === 0) return 0;
    
    const totalScore = gradedSubmissions.reduce((sum, s) => sum + s.score, 0);
    return Math.round(totalScore / gradedSubmissions.length);
  }
}
