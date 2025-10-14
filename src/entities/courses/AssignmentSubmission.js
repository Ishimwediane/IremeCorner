import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Assignment } from './Assignment.js';
import { User } from '../auth/User.js';

export const SubmissionStatus = {
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned',
};

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'text', nullable: true })
  submissionText;

  @Column({ type: 'json', nullable: true })
  attachments; // File attachments

  @Column({ type: 'json', nullable: true })
  answers; // For quiz submissions

  @Column({ type: 'int', nullable: true })
  score;

  @Column({ type: 'text', nullable: true })
  feedback;

  @Column({ type: 'enum', enum: Object.values(SubmissionStatus), default: SubmissionStatus.SUBMITTED })
  status;

  @Column({ type: 'timestamp', nullable: true })
  gradedAt;

  @Column({ type: 'uuid', nullable: true })
  gradedBy;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Assignment, assignment => assignment.submissions)
  @JoinColumn({ name: 'assignmentId' })
  assignment;

  @Column({ type: 'uuid' })
  assignmentId;

  @ManyToOne(() => User, user => user.assignmentSubmissions)
  @JoinColumn({ name: 'studentId' })
  student;

  @Column({ type: 'uuid' })
  studentId;

  // Methods
  getGradePercentage() {
    if (!this.score || !this.assignment) return 0;
    return Math.round((this.score / this.assignment.maxPoints) * 100);
  }

  isGraded() {
    return this.status === SubmissionStatus.GRADED;
  }

  isLate() {
    if (!this.assignment) return false;
    return new Date(this.createdAt) > new Date(this.assignment.dueDate);
  }
}
