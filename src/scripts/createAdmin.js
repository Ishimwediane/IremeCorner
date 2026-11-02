import { initializeDatabase, closeDatabase } from '../config/database.js';
import { configs } from '../config/index.js';
import { ensureAdminUser } from '../utils/bootstrap.js';

// Creates the store admin from ADMIN_EMAIL / ADMIN_PASSWORD. Safe to run more than once.
async function createAdmin() {
  try {
    await initializeDatabase();

    const result = await ensureAdminUser();
    console.log(result.created
      ? `✓ Admin account created for ${configs.admin.email}`
      : `- No admin created: ${result.reason}`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
