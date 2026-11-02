import { initializeDatabase, closeDatabase } from '../config/database.js';
import { ensureDefaultCategories } from '../utils/bootstrap.js';

async function seedCategories() {
  try {
    await initializeDatabase();

    const created = await ensureDefaultCategories();
    console.log(created.length
      ? `✓ Created categories: ${created.join(', ')}`
      : '- All default categories already exist');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
