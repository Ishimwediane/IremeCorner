import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserSchema } from '../entities/auth/User.js';
import { ProductSchema } from '../entities/products/Product.js';
import { CategorySchema } from '../entities/products/Category.js';
import { OrderSchema } from '../entities/orders/Order.js';
import { OrderItemSchema } from '../entities/orders/OrderItem.js';
import { CourseSchema } from '../entities/courses/Course.js';
import { EnrollmentSchema } from '../entities/courses/Enrollment.js';
import { AssignmentSchema } from '../entities/courses/Assignment.js';
import { AssignmentSubmissionSchema } from '../entities/courses/AssignmentSubmission.js';
import { AchievementSchema } from '../entities/courses/Achievement.js';
import { CertificateSchema } from '../entities/courses/Certificate.js';
import { PaymentSchema } from '../entities/payments/Payment.js';
import { NotificationSchema } from '../entities/notifications/Notification.js';
import { ReviewSchema } from '../entities/reviews/Review.js';
import { WishlistItemSchema } from '../entities/wishlist/WishlistItem.js';
import { MessageSchema } from '../entities/messaging/Message.js';
import { ConversationSchema } from '../entities/messaging/Conversation.js';
import { AnalyticsEventSchema } from '../entities/analytics/AnalyticsEvent.js';
import { StoreSchema } from '../entities/stores/Store.js';
import { PromotionSchema } from '../entities/promotions/Promotion.js';
import { InventoryItemSchema } from '../entities/inventory/InventoryItem.js';
import { SocialPostSchema } from '../entities/social/SocialPost.js';
import { LikeSchema } from '../entities/social/Like.js';
import { CommentSchema } from '../entities/social/Comment.js';
import { FollowSchema } from '../entities/social/Follow.js';
import { ContentPageSchema } from '../entities/content/ContentPage.js';
import { MediaFileSchema } from '../entities/content/MediaFile.js';
import { SystemLogSchema } from '../entities/admin/SystemLog.js';
import { SystemSettingSchema } from '../entities/admin/SystemSetting.js';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iremecorner_db',
  synchronize: false, // Disable synchronize to avoid conflicts
  logging: process.env.NODE_ENV === 'development',
  entities: [
    UserSchema,
    ProductSchema,
    CategorySchema,
    OrderSchema,
    OrderItemSchema,
    CourseSchema,
    EnrollmentSchema,
    AssignmentSchema,
    AssignmentSubmissionSchema,
    AchievementSchema,
    CertificateSchema,
    PaymentSchema,
    NotificationSchema,
    ReviewSchema,
    WishlistItemSchema,
    MessageSchema,
    ConversationSchema,
    AnalyticsEventSchema,
    StoreSchema,
    PromotionSchema,
    InventoryItemSchema,
    SocialPostSchema,
    LikeSchema,
    CommentSchema,
    FollowSchema,
    ContentPageSchema,
    MediaFileSchema,
    SystemLogSchema,
    SystemSettingSchema
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
