import { AppDataSource } from '../config/database.js';
import { Category } from '../entities/products/Category.js';

const CATEGORIES = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Basket",
    description: "Handmade baskets",
    type: "product",
    isActive: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Wall Arts",
    description: "Decorative wall arts",
    type: "product",
    isActive: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Pottery",
    description: "Clay pottery items",
    type: "product",
    isActive: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Others",
    description: "Other artisan products",
    type: "product",
    isActive: true
  }
];

async function seedCategories() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const categoryRepository = AppDataSource.getRepository(Category);

    for (const categoryData of CATEGORIES) {
      // Check if category already exists
      const existing = await categoryRepository.findOne({ 
        where: { id: categoryData.id } 
      });

      if (!existing) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`✓ Created category: ${categoryData.name}`);
      } else {
        console.log(`- Category already exists: ${categoryData.name}`);
      }
    }

    console.log('✓ Categories seeded successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();