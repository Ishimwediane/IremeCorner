import { EntitySchema } from 'typeorm';

export const FollowStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked',
};

export const FollowSchema = new EntitySchema({
  name: 'Follow',
  tableName: 'follows',
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

export class Follow {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
