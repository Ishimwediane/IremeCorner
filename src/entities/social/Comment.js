import { EntitySchema } from 'typeorm';

export const CommentStatus = {
  ACTIVE: 'active',
  HIDDEN: 'hidden',
  DELETED: 'deleted',
};

export const CommentSchema = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
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

export class Comment {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}

