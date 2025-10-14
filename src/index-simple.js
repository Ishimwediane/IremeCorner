import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';

const app = express();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your_super_secret_jwt_key_here';

// Mock users database
const users = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'buyer'
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'artisan'
  },
  {
    id: 'user-3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

// Mock products database
const products = [
  {
    id: 'product-1',
    name: 'Handmade Silver Ring',
    description: 'Beautiful handmade silver ring with intricate design',
    price: 89.99,
    stock: 10,
    status: 'active',
    artisanId: 'user-2',
    artisanName: 'Jane Smith'
  },
  {
    id: 'product-2',
    name: 'Ceramic Bowl',
    description: 'Handcrafted ceramic bowl perfect for serving',
    price: 45.99,
    stock: 5,
    status: 'active',
    artisanId: 'user-2',
    artisanName: 'Jane Smith'
  }
];

// Mock courses database
const courses = [
  {
    id: 'course-1',
    title: 'Introduction to Jewelry Making',
    description: 'Learn the basics of jewelry making with this comprehensive course',
    price: 149.99,
    level: 'beginner',
    duration: 120,
    instructorId: 'user-2',
    instructorName: 'Jane Smith'
  }
];

// Mock orders database
const orders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-123456',
    userId: 'user-1',
    total: 179.98,
    status: 'pending',
    items: [
      {
        productId: 'product-1',
        quantity: 2
      }
    ],
    createdAt: new Date().toISOString()
  }
];

// Mock payments database
const payments = [
  {
    id: 'payment-1',
    transactionId: 'TXN-123456',
    userId: 'user-1',
    orderId: 'order-1',
    amount: 179.98,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IremeCorner API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API routes for testing
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'IremeCorner API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      courses: '/api/courses',
      orders: '/api/orders',
      payments: '/api/payments'
    }
  });
});

// Mock authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    password, // In real app, hash this password
    role: role || 'buyer'
  };
  
  users.push(newUser);

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      accessToken: token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken: token,
      refreshToken: 'mock-refresh-token',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    }
  });
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
});

// Get all users (Admin only)
app.get('/api/users', authenticateToken, requireRole(['admin']), (req, res) => {
  const usersList = users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  }));

  res.json({
    success: true,
    data: {
      users: usersList,
      total: usersList.length
    }
  });
});

// Product endpoints
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: products,
      pagination: {
        page: 1,
        limit: 10,
        total: products.length
      }
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  const featuredProducts = products.filter(p => p.status === 'active').slice(0, 3);
  res.json({
    success: true,
    data: featuredProducts
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Artisan product management
app.post('/api/products', authenticateToken, requireRole(['artisan', 'admin']), (req, res) => {
  const { name, description, price, stock, material, dimensions, color, style } = req.body;
  
  const newProduct = {
    id: `product-${Date.now()}`,
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    status: 'active',
    material,
    dimensions,
    color,
    style,
    artisanId: req.user.id,
    artisanName: req.user.firstName + ' ' + req.user.lastName,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

app.put('/api/products/:id', authenticateToken, requireRole(['artisan', 'admin']), (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  // Check if artisan owns this product (unless admin)
  if (req.user.role !== 'admin' && product.artisanId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own products'
    });
  }
  
  // Update product
  Object.assign(product, req.body);
  product.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

app.delete('/api/products/:id', authenticateToken, requireRole(['artisan', 'admin']), (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const product = products[productIndex];
  
  // Check if artisan owns this product (unless admin)
  if (req.user.role !== 'admin' && product.artisanId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own products'
    });
  }
  
  products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Get artisan's products
app.get('/api/products/my-products', authenticateToken, requireRole(['artisan', 'admin']), (req, res) => {
  const userProducts = products.filter(p => p.artisanId === req.user.id);
  
  res.json({
    success: true,
    data: {
      products: userProducts,
      total: userProducts.length
    }
  });
});

// Mock course endpoints
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      courses: [
        {
          id: 'mock-course-1',
          title: 'Introduction to Jewelry Making',
          description: 'Learn the basics of jewelry making',
          price: 149.99,
          level: 'beginner',
          duration: 120
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1
      }
    }
  });
});

app.get('/api/courses/featured', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'mock-course-1',
        title: 'Featured Jewelry Making Course',
        description: 'Learn the basics of jewelry making',
        price: 149.99,
        level: 'beginner'
      }
    ]
  });
});

// Order endpoints
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, shippingAddress, billingAddress, notes } = req.body;
  
  // Calculate total
  let total = 0;
  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    return {
      ...item,
      productName: product.name,
      productPrice: product.price,
      itemTotal
    };
  });
  
  const newOrder = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${Date.now()}`,
    userId: req.user.id,
    total: total,
    status: 'pending',
    items: orderItems,
    shippingAddress,
    billingAddress,
    notes,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder
  });
});

app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  
  res.json({
    success: true,
    data: {
      orders: userOrders,
      total: userOrders.length
    }
  });
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Check if user owns this order (unless admin)
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view your own orders'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// Get all orders (Admin only)
app.get('/api/orders', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({
    success: true,
    data: {
      orders: orders,
      total: orders.length
    }
  });
});

// Payment endpoints
app.post('/api/payments/order/:orderId', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  // Check if user owns this order
  if (order.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only initiate payment for your own orders'
    });
  }
  
  const newPayment = {
    id: `payment-${Date.now()}`,
    transactionId: `TXN-${Date.now()}`,
    userId: req.user.id,
    orderId: order.id,
    amount: order.total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  payments.push(newPayment);
  
  const whatsappLink = `https://wa.me/1234567890?text=Hello! I would like to make a payment for order ${order.orderNumber}. Amount: $${order.total}`;
  
  res.json({
    success: true,
    message: 'Payment initiated. Please complete payment via WhatsApp.',
    data: {
      paymentId: newPayment.id,
      transactionId: newPayment.transactionId,
      whatsappLink: whatsappLink,
      amount: order.total,
      orderNumber: order.orderNumber
    }
  });
});

app.get('/api/payments/history', authenticateToken, (req, res) => {
  const userPayments = payments.filter(p => p.userId === req.user.id);
  
  res.json({
    success: true,
    data: {
      payments: userPayments,
      total: userPayments.length
    }
  });
});

// Get pending payments (Admin only)
app.get('/api/payments/pending', authenticateToken, requireRole(['admin']), (req, res) => {
  const pendingPayments = payments.filter(p => p.status === 'pending');
  
  res.json({
    success: true,
    data: {
      payments: pendingPayments,
      total: pendingPayments.length
    }
  });
});

// Confirm payment (Admin only)
app.post('/api/payments/:paymentId/confirm', authenticateToken, requireRole(['admin']), (req, res) => {
  const payment = payments.find(p => p.id === req.params.paymentId);
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  payment.status = 'completed';
  payment.completedAt = new Date().toISOString();
  
  // Update order status
  const order = orders.find(o => o.id === payment.orderId);
  if (order) {
    order.status = 'paid';
  }
  
  res.json({
    success: true,
    message: 'Payment confirmed successfully',
    data: payment
  });
});

// Admin endpoints
app.get('/api/admin/dashboard', authenticateToken, requireRole(['admin']), (req, res) => {
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  res.json({
    success: true,
    message: 'Admin dashboard',
    data: {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCourses: courses.length,
      totalRevenue: totalRevenue,
      pendingPayments: payments.filter(p => p.status === 'pending').length
    }
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  GET  /api - API information');
  console.log('  POST /api/auth/register - Register user');
  console.log('  POST /api/auth/login - Login user');
  console.log('  GET  /api/auth/profile - Get user profile');
  console.log('  GET  /api/products - Get products');
  console.log('  GET  /api/products/featured - Get featured products');
  console.log('  GET  /api/courses - Get courses');
  console.log('  GET  /api/courses/featured - Get featured courses');
  console.log('  POST /api/orders - Create order');
  console.log('  GET  /api/orders/my-orders - Get user orders');
  console.log('  POST /api/payments/order/:orderId - Initiate payment');
  console.log('  GET  /api/payments/history - Get payment history');
  console.log('  GET  /api/admin/dashboard - Admin dashboard');
});

export default app;
