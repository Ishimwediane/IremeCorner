import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/auth/User.js';
import { ProductSchema } from '../entities/products/Product.js';
import { Category } from '../entities/products/Category.js';
import { Order } from '../entities/orders/Order.js';
import { OrderItem } from '../entities/orders/OrderItem.js';
import { Course } from '../entities/courses/Course.js';
import { Enrollment } from '../entities/courses/Enrollment.js';
import { Assignment } from '../entities/courses/Assignment.js';
import { AssignmentSubmission } from '../entities/courses/AssignmentSubmission.js';
import { Achievement } from '../entities/courses/Achievement.js';
import { Certificate } from '../entities/courses/Certificate.js';
import { Payment } from '../entities/payments/Payment.js';
import { Notification } from '../entities/notifications/Notification.js';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iremecorner_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    ProductSchema,
    Category,
    Order,
    OrderItem,
    Course,
    Enrollment,
    Assignment,
    AssignmentSubmission,
    Achievement,
    Certificate,
    Payment,
    Notification
  ],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js'],
  useUnifiedTopology: true,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};
