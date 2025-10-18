import { EntitySchema } from 'typeorm';

export const LikeType = {
  POST: 'post',
  COMMENT: 'comment',
  PRODUCT: 'product',
  COURSE: 'course',
};

export const LikeSchema = new EntitySchema({
  name: 'Like',
  tableName: 'likes',
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

export class Like {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



