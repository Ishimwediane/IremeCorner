import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { uuidId, baseSchemaOptions } from '../schemaOptions.js';

export const UserRole = {
  BUYER: 'buyer',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
};

const userSchema = new mongoose.Schema({
  _id: uuidId,
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 255 },
  password: { type: String, required: true, select: false },
  phone: { type: String, maxlength: 20, default: null },
  avatar: { type: String, maxlength: 500, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.BUYER },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  bio: { type: String, maxlength: 500, default: null },
  address: { type: String, maxlength: 255, default: null },
  city: { type: String, maxlength: 100, default: null },
  state: { type: String, maxlength: 100, default: null },
  zipCode: { type: String, maxlength: 20, default: null },
  country: { type: String, maxlength: 100, default: null },
  website: { type: String, maxlength: 255, default: null },
  socialMedia: { type: String, maxlength: 255, default: null },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, baseSchemaOptions);

// Hash only when the password changes, so saving a user never double-hashes it.
userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function getFullName() {
  return `${this.firstName} ${this.lastName}`;
};

// Public fields safe to include when another document references a user.
export const PUBLIC_USER_FIELDS = 'firstName lastName email phone avatar role';

export const User = mongoose.model('User', userSchema);
