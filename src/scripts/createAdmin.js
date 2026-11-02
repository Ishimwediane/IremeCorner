import { AppDataSource } from '../config/database.js';
import { User, UserRole } from '../entities/auth/User.js';
import { configs } from '../config/index.js';

// Creates the store admin from ADMIN_EMAIL / ADMIN_PASSWORD. Safe to run more than once.
async function createAdmin() {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    const existing = await userRepository.findOne({ where: { email: configs.admin.email } });
    if (existing) {
      console.log(`- Account already exists for ${configs.admin.email} (role: ${existing.role})`);
    } else {
      const admin = userRepository.create({
        firstName: 'IremeCorner',
        lastName: 'Admin',
        email: configs.admin.email,
        password: configs.admin.password,
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true
      });
      await userRepository.save(admin);
      console.log(`✓ Admin account created for ${configs.admin.email}`);
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
