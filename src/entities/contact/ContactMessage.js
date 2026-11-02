import mongoose from 'mongoose';
import { uuidId, baseSchemaOptions } from '../schemaOptions.js';

export const ContactMessageStatus = {
  NEW: 'new',
  READ: 'read',
  REPLIED: 'replied',
};

const contactMessageSchema = new mongoose.Schema({
  _id: uuidId,
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, maxlength: 30, default: null },
  subject: { type: String, maxlength: 200, default: null },
  message: { type: String, required: true },
  status: { type: String, enum: Object.values(ContactMessageStatus), default: ContactMessageStatus.NEW },
}, baseSchemaOptions);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
