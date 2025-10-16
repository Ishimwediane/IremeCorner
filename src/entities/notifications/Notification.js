import { EntitySchema } from 'typeorm';

export const NotificationType = {
  ORDER: 'order',
  PAYMENT: 'payment',
  COURSE: 'course',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
};
export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const NotificationSchema = new EntitySchema({
  name: 'Notification',
  tableName: 'notifications',
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

export class Notification {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
