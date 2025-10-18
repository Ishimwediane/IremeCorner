import { EntitySchema } from 'typeorm';

export const AssignmentType = {
  PROJECT: 'project',
  QUIZ: 'quiz',
  ESSAY: 'essay',
  PRESENTATION: 'presentation',
};

export const AssignmentSchema = new EntitySchema({
  name: 'Assignment',
  tableName: 'assignments',
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

export class Assignment {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



