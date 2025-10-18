import { EntitySchema } from 'typeorm';

export const AchievementType = {
  LESSON_COMPLETION: 'lesson_completion',
  QUIZ_SCORE: 'quiz_score',
  COURSE_COMPLETION: 'course_completion',
  ASSIGNMENT_COMPLETION: 'assignment_completion',
  STREAK: 'streak',
  PERFECT_SCORE: 'perfect_score',
};

export const AchievementSchema = new EntitySchema({
  name: 'Achievement',
  tableName: 'achievements',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    }
    // TODO: Add other column definitions
  },
  relations: {
    // TODO: Add relation definitions
  }
});

export class Achievement {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



