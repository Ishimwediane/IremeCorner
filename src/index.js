import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import 'reflect-metadata';

import { initializeDatabase } from './config/database.js';
import { configs } from './config/index.js';
import { generalLimiter } from './middleware/rateLimit/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/error/errorHandler.js';

// Import routes
import authRoutes from './routes/auth/authRoutes.js';
import productRoutes from './routes/products/productRoutes.js';
import orderRoutes from './routes/orders/orderRoutes.js';
import courseRoutes from './routes/courses/courseRoutes.js';
import assignmentRoutes from './routes/courses/assignmentRoutes.js';
import achievementRoutes from './routes/courses/achievementRoutes.js';
import certificateRoutes from './routes/courses/certificateRoutes.js';
import paymentRoutes from './routes/payments/paymentRoutes.js';
import notificationRoutes from './routes/notifications/notificationRoutes.js';
import reviewRoutes from './routes/reviews/reviewRoutes.js';
import wishlistRoutes from './routes/wishlist/wishlistRoutes.js';
import searchRoutes from './routes/search/searchRoutes.js';
import messagingRoutes from './routes/messaging/messagingRoutes.js';
import analyticsRoutes from './routes/analytics/analyticsRoutes.js';
import storeRoutes from './routes/stores/storeRoutes.js';
import promotionRoutes from './routes/promotions/promotionRoutes.js';
import inventoryRoutes from './routes/inventory/inventoryRoutes.js';

const app = express();

// Initialize database
await initializeDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: configs.cors.origin,
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (configs.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IremeCorner API is running',
    timestamp: new Date().toISOString(),
    environment: configs.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/inventory', inventoryRoutes);

// Admin routes (placeholder for future admin functionality)
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard endpoint',
    data: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalCourses: 0,
      totalRevenue: 0
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = configs.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${configs.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
