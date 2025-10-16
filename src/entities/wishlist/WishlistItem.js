import { EntitySchema } from 'typeorm';

export const WishlistItemType = {
  PRODUCT: 'product',
  COURSE: 'course',
};

export const WishlistItemSchema = new EntitySchema({
  name: 'WishlistItem',
  tableName: 'wishlist_items',
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

export class WishlistItem {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
