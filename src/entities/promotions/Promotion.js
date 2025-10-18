import { EntitySchema } from 'typeorm';

export const PromotionType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping',
  BUY_X_GET_Y: 'buy_x_get_y',
  BULK_DISCOUNT: 'bulk_discount',
};
export const PromotionStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};
export const PromotionTarget = {
  ALL_PRODUCTS: 'all_products',
  SPECIFIC_PRODUCTS: 'specific_products',
  ALL_COURSES: 'all_courses',
  SPECIFIC_COURSES: 'specific_courses',
  ALL_USERS: 'all_users',
  SPECIFIC_USERS: 'specific_users',
  NEW_USERS: 'new_users',
};

export const PromotionSchema = new EntitySchema({
  name: 'Promotion',
  tableName: 'promotions',
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

export class Promotion {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



