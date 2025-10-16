import { EntitySchema } from 'typeorm';

export const OrderItemSchema = new EntitySchema({
  name: 'OrderItem',
  tableName: 'order_items',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    quantity: {
      type: 'int'
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    originalPrice: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true
    },
    total: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    productName: {
      type: 'varchar',
      length: 200
    },
    productImage: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    productSpecifications: {
      type: 'json',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    },
    orderId: {
      type: 'uuid'
    },
    productId: {
      type: 'uuid'
    }
  },
  relations: {
    order: {
      target: 'Order',
      type: 'many-to-one',
      joinColumn: { name: 'orderId' },
      onDelete: 'CASCADE'
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: { name: 'productId' }
    }
  }
});

export class OrderItem {
  constructor() {
    this.id = null;
    this.quantity = 0;
    this.price = 0;
    this.originalPrice = null;
    this.total = 0;
    this.productName = '';
    this.productImage = null;
    this.productSpecifications = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.orderId = null;
    this.productId = null;
  }

  calculateTotal() {
    this.total = this.price * this.quantity;
  }

  getDiscountAmount() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return (this.originalPrice - this.price) * this.quantity;
    }
    return 0;
  }
}

