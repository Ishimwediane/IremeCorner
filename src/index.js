import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import 'reflect-metadata';


import { initializeDatabase } from './config/database.js';
import { bootstrap } from './utils/bootstrap.js';
import { configs } from './config/index.js';
import { generalLimiter } from './middleware/rateLimit/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/error/errorHandler.js';

// Import routes
import authRoutes from './routes/auth/authRoutes.js';
import productRoutes from './routes/products/productRoutes.js';
import orderRoutes from './routes/orders/orderRoutes.js';
import courseRoutes from './routes/courses/courseRoutes.js';
import paymentRoutes from './routes/payments/paymentRoutes.js';
import categoryRoutes from './routes/categories/categoryRoutes.js';
import contactRoutes from './routes/contact/contactRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';

const app = express();

const start = async () => {
  // Initialize database
  await initializeDatabase();
  await bootstrap();

  // Security middleware
 app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/uploads', express.static('uploads'));
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
  app.use('/api/categories', categoryRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/admin', adminRoutes);

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
};

start().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

export default app;