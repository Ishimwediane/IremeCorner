import { EntitySchema } from 'typeorm';

export const PaymentMethod = {
  WHATSAPP: 'whatsapp',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
};
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};
export const PaymentType = {
  ORDER: 'order',
  COURSE: 'course',
  SUBSCRIPTION: 'subscription',
};

export const PaymentSchema = new EntitySchema({
  name: 'Payment',
  tableName: 'payments',
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

export class Payment {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
