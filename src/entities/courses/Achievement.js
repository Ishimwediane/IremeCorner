import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course.js';
import { User } from '../auth/User.js';

export const AchievementType = {
  LESSON_COMPLETION: 'lesson_completion',
  QUIZ_SCORE: 'quiz_score',
  COURSE_COMPLETION: 'course_completion',
  ASSIGNMENT_COMPLETION: 'assignment_completion',
  STREAK: 'streak',
  PERFECT_SCORE: 'perfect_score',
};

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100 })
  name;

  @Column({ type: 'text' })
  description;

  @Column({ type: 'varchar', length: 10 })
  icon; // Emoji or icon identifier

  @Column({ type: 'int', default: 0 })
  points;

  @Column({ type: 'enum', enum: Object.values(AchievementType) })
  type;

  @Column({ type: 'int', default: 1 })
  requirement; // Number required to earn achievement

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => Course, course => course.achievements, { nullable: true })
  @JoinColumn({ name: 'courseId' })
  course;

  @Column({ type: 'uuid', nullable: true })
  courseId;

  // Methods
  isEarnedByUser(userId, userProgress) {
    switch (this.type) {
      case AchievementType.LESSON_COMPLETION:
        return userProgress.completedLessons >= this.requirement;
      case AchievementType.QUIZ_SCORE:
        return userProgress.averageQuizScore >= this.requirement;
      case AchievementType.COURSE_COMPLETION:
        return userProgress.progress >= 100;
      case AchievementType.ASSIGNMENT_COMPLETION:
        return userProgress.completedAssignments >= this.requirement;
      default:
        return false;
    }
  }
}
