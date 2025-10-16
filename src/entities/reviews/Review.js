import { EntitySchema } from 'typeorm';

export const ReviewType = {
  PRODUCT: 'product',
  COURSE: 'course',
  ARTISAN: 'artisan',
  TRAINER: 'trainer',
};
export const ReviewStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  HIDDEN: 'hidden',
};

export const ReviewSchema = new EntitySchema({
  name: 'Review',
  tableName: 'reviews',
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

export class Review {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}

