import { EntitySchema } from 'typeorm';

export const ConversationType = {
  DIRECT: 'direct',
  GROUP: 'group',
  SUPPORT: 'support',
};
export const ConversationStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  BLOCKED: 'blocked',
};

export const ConversationSchema = new EntitySchema({
  name: 'Conversation',
  tableName: 'conversations',
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

export class Conversation {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



