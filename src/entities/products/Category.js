import { EntitySchema } from 'typeorm';

export const CategoryType = {
  PRODUCT: 'product',
  COURSE: 'course',
};

export const CategorySchema = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    name: {
      type: 'varchar',
      length: 100
    },
    description: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    image: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    type: {
      type: 'enum',
      enum: Object.values(CategoryType)
    },
    slug: {
      type: 'varchar',
      length: 50,
      nullable: true
    },
    isActive: {
      type: 'boolean',
      default: true
    },
    sortOrder: {
      type: 'int',
      default: 0
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    products: {
      target: 'Product',
      type: 'one-to-many',
      inverseSide: 'category'
    },
    courses: {
      target: 'Course',
      type: 'one-to-many',
      inverseSide: 'category'
    }
  }
});

export class Category {
  constructor() {
    this.id = null;
    this.name = '';
    this.description = null;
    this.image = null;
    this.type = CategoryType.PRODUCT;
    this.slug = null;
    this.isActive = true;
    this.sortOrder = 0;
    this.createdAt = null;
    this.updatedAt = null;
  }
}

