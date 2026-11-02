import mongoose from 'mongoose';
import { uuidId, baseSchemaOptions } from '../schemaOptions.js';

const categorySchema = new mongoose.Schema({
  _id: uuidId,
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: null },
  image: { type: String, maxlength: 500, default: null },
  slug: { type: String, maxlength: 50, default: null },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, baseSchemaOptions);

export const Category = mongoose.model('Category', categorySchema);
