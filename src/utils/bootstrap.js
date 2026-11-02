import fs from 'fs';
import path from 'path';
import { User, UserRole } from '../entities/auth/User.js';
import { Category } from '../entities/products/Category.js';
import { configs } from '../config/index.js';

export const DEFAULT_CATEGORIES = [
  { _id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Basket', description: 'Handmade baskets' },
  { _id: '550e8400-e29b-41d4-a716-446655440002', name: 'Wall Arts', description: 'Decorative wall arts' },
  { _id: '550e8400-e29b-41d4-a716-446655440003', name: 'Pottery', description: 'Clay pottery items' },
  { _id: '550e8400-e29b-41d4-a716-446655440004', name: 'Others', description: 'Other artisan products' },
];

// Adds any default category that is missing. Safe to run on every start.
export async function ensureDefaultCategories() {
  const created = [];

  for (const categoryData of DEFAULT_CATEGORIES) {
    const exists = await Category.exists({ _id: categoryData._id });
    if (!exists) {
      await Category.create({ ...categoryData, isActive: true });
      created.push(categoryData.name);
    }
  }

  return created;
}

// Creates the store admin from ADMIN_EMAIL / ADMIN_PASSWORD if no account uses that email yet.
export async function ensureAdminUser() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return { created: false, reason: 'ADMIN_EMAIL or ADMIN_PASSWORD not set' };
  }

  const existing = await User.findOne({ email: configs.admin.email.toLowerCase() });
  if (existing) {
    return { created: false, reason: `account already exists (role: ${existing.role})` };
  }

  await User.create({
    firstName: 'IremeCorner',
    lastName: 'Admin',
    email: configs.admin.email,
    password: configs.admin.password,
    role: UserRole.ADMIN,
    isEmailVerified: true,
    isActive: true
  });

  return { created: true };
}

// multer does not create its destination folders, so make sure they exist.
export function ensureUploadFolders() {
  for (const folder of ['products', 'avatars']) {
    fs.mkdirSync(path.join(configs.upload.uploadPath, folder), { recursive: true });
  }
}

export async function bootstrap() {
  ensureUploadFolders();

  const categories = await ensureDefaultCategories();
  if (categories.length) {
    console.log(`✓ Created categories: ${categories.join(', ')}`);
  }

  const admin = await ensureAdminUser();
  if (admin.created) {
    console.log(`✓ Admin account created for ${configs.admin.email}`);
  }
}
