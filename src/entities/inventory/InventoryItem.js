import { EntitySchema } from 'typeorm';

export const InventoryActionType = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
  DAMAGED: 'damaged',
  LOST: 'lost',
  TRANSFER: 'transfer',
};
export const InventoryStatus = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

export const InventoryItemSchema = new EntitySchema({
  name: 'InventoryItem',
  tableName: 'inventory_items',
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

export class InventoryItem {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
