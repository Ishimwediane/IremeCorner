import { AppDataSource } from '../config/database.js';
import { ensureDefaultCategories } from '../utils/bootstrap.js';

async function seedCategories() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const created = await ensureDefaultCategories();
    console.log(created.length
      ? `✓ Created categories: ${created.join(', ')}`
      : '- All default categories already exist');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
