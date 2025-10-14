import { EntitySchema } from 'typeorm';

export const ProductStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
};

export const ProductSchema = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    name: {
      type: 'varchar',
      length: 200
    },
    description: {
      type: 'text'
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
    stock: {
      type: 'int',
      default: 0
    },
    status: {
      type: 'varchar',
      length: 50,
      default: ProductStatus.DRAFT
    },
    mainImage: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    images: {
      type: 'json',
      nullable: true
    },
    tags: {
      type: 'json',
      nullable: true
    },
    material: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    dimensions: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    weight: {
      type: 'varchar',
      length: 50,
      nullable: true
    },
    color: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    style: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    views: {
      type: 'int',
      default: 0
    },
    sales: {
      type: 'int',
      default: 0
    },
    rating: {
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0
    },
    reviewCount: {
      type: 'int',
      default: 0
    },
    isActive: {
      type: 'boolean',
      default: true
    },
    slug: {
      type: 'varchar',
      length: 200,
      nullable: true
    },
    specifications: {
      type: 'json',
      nullable: true
    },
    careInstructions: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    shippingInfo: {
      type: 'varchar',
      length: 500,
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
    artisanId: {
      type: 'uuid'
    },
    categoryId: {
      type: 'uuid'
    }
  },
  relations: {
    artisan: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'artisanId' }
    },
    category: {
      target: 'Category',
      type: 'many-to-one',
      joinColumn: { name: 'categoryId' }
    },
    orderItems: {
      target: 'OrderItem',
      type: 'one-to-many',
      inverseSide: 'product'
    }
  }
});

export class Product {
  constructor() {
    this.id = null;
    this.name = '';
    this.description = '';
    this.price = 0;
    this.originalPrice = null;
    this.stock = 0;
    this.status = ProductStatus.DRAFT;
    this.mainImage = null;
    this.images = null;
    this.tags = null;
    this.material = null;
    this.dimensions = null;
    this.weight = null;
    this.color = null;
    this.style = null;
    this.views = 0;
    this.sales = 0;
    this.rating = 0;
    this.reviewCount = 0;
    this.isActive = true;
    this.slug = null;
    this.specifications = null;
    this.careInstructions = null;
    this.shippingInfo = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.artisanId = null;
    this.categoryId = null;
  }

  getDiscountPercentage() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }

  isInStock() {
    return this.stock > 0 && this.status === ProductStatus.ACTIVE;
  }

  updateRating(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  }
}