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
import paymentRoutes from './routes/payments/paymentRoutes.js';

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
app.use('/api/payments', paymentRoutes);

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
