import { AppDataSource } from '../config/database.js';
import { UserSchema, UserRole } from '../entities/auth/User.js';
import { CategorySchema, CategoryType } from '../entities/products/Category.js';
import { configs } from '../config/index.js';

export class DatabaseSeeder {
  static async seed() {
    try {
      console.log('🌱 Starting database seeding...');

      // Create admin user
      await this.createAdminUser();

      // Create default categories
      await this.createDefaultCategories();

      console.log('✅ Database seeding completed successfully');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  static async createAdminUser() {
    const userRepository = AppDataSource.getRepository(UserSchema);
    
    const existingAdmin = await userRepository.findOne({
      where: { email: configs.admin.email }
    });

    if (!existingAdmin) {
      const admin = userRepository.create({
        firstName: 'Admin',
        lastName: 'User',
        email: configs.admin.email,
        password: configs.admin.password,
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true
      });

      await userRepository.save(admin);
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }
  }

  static async createDefaultCategories() {
    const categoryRepository = AppDataSource.getRepository(CategorySchema);

    const productCategories = [
      { name: 'Jewelry', description: 'Handmade jewelry and accessories', type: CategoryType.PRODUCT },
      { name: 'Home Decor', description: 'Decorative items for your home', type: CategoryType.PRODUCT },
      { name: 'Textiles', description: 'Fabric-based crafts and textiles', type: CategoryType.PRODUCT },
      { name: 'Pottery', description: 'Ceramic and pottery items', type: CategoryType.PRODUCT },
      { name: 'Woodwork', description: 'Wooden crafts and furniture', type: CategoryType.PRODUCT },
      { name: 'Art & Paintings', description: 'Original artwork and paintings', type: CategoryType.PRODUCT }
    ];

    const courseCategories = [
      { name: 'Jewelry Making', description: 'Learn to create beautiful jewelry', type: CategoryType.COURSE },
      { name: 'Pottery & Ceramics', description: 'Master the art of pottery', type: CategoryType.COURSE },
      { name: 'Textile Arts', description: 'Explore fabric and textile crafts', type: CategoryType.COURSE },
      { name: 'Woodworking', description: 'Learn woodworking techniques', type: CategoryType.COURSE },
      { name: 'Painting & Drawing', description: 'Develop your artistic skills', type: CategoryType.COURSE },
      { name: 'Digital Crafts', description: 'Modern digital crafting techniques', type: CategoryType.COURSE }
    ];

    const allCategories = [...productCategories, ...courseCategories];

    for (const categoryData of allCategories) {
      const existingCategory = await categoryRepository.findOne({
        where: { name: categoryData.name, type: categoryData.type }
      });

      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`📂 Category created: ${categoryData.name} (${categoryData.type})`);
      }
    }

    console.log('📂 Default categories created');
  }
}




