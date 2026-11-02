import { v4 as uuidv4 } from 'uuid';

// Documents keep UUID string ids so existing links and the frontend keep working.
export const uuidId = { type: String, default: () => uuidv4() };

// Shape documents like the previous API: an `id` field, no `_id`/`__v`, virtuals included.
const transform = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  return ret;
};

export const baseSchemaOptions = {
  timestamps: true,
  toJSON: { virtuals: true, transform },
  toObject: { virtuals: true, transform },
};

export const subSchemaOptions = {
  toJSON: { virtuals: true, transform },
  toObject: { virtuals: true, transform },
};

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
