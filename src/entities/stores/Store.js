import { EntitySchema } from 'typeorm';

export const StoreStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
};
export const StoreType = {
  ARTISAN: 'artisan',
  TRAINER: 'trainer',
  HYBRID: 'hybrid', // Both products and courses
};

export const StoreSchema = new EntitySchema({
  name: 'Store',
  tableName: 'stores',
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

export class Store {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



