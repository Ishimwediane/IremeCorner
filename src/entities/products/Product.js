import mongoose from 'mongoose';
import { uuidId, baseSchemaOptions } from '../schemaOptions.js';

export const ProductStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
};

const productSchema = new mongoose.Schema({
  _id: uuidId,
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  stock: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.DRAFT },
  mainImage: { type: String, maxlength: 500, default: null },
  images: { type: [String], default: undefined },
  tags: { type: [String], default: undefined },
  material: { type: String, maxlength: 100, default: null },
  dimensions: { type: String, maxlength: 100, default: null },
  weight: { type: String, maxlength: 50, default: null },
  color: { type: String, maxlength: 100, default: null },
  style: { type: String, maxlength: 100, default: null },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  slug: { type: String, maxlength: 200, default: null },
  specifications: { type: mongoose.Schema.Types.Mixed, default: null },
  careInstructions: { type: String, maxlength: 500, default: null },
  shippingInfo: { type: String, maxlength: 500, default: null },
  artisanId: { type: String, ref: 'User', required: true, index: true },
  categoryId: { type: String, ref: 'Category', required: true, index: true },
}, baseSchemaOptions);

productSchema.index({ isActive: 1, status: 1, createdAt: -1 });

productSchema.virtual('artisan', { ref: 'User', localField: 'artisanId', foreignField: '_id', justOne: true });
productSchema.virtual('category', { ref: 'Category', localField: 'categoryId', foreignField: '_id', justOne: true });

productSchema.methods.getDiscountPercentage = function getDiscountPercentage() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
};

productSchema.methods.isInStock = function isInStock() {
  return this.stock > 0 && this.status === ProductStatus.ACTIVE;
};

productSchema.methods.updateRating = function updateRating(newRating) {
  const totalRating = (this.rating * this.reviewCount) + newRating;
  this.reviewCount += 1;
  this.rating = totalRating / this.reviewCount;
};

export const Product = mongoose.model('Product', productSchema);
