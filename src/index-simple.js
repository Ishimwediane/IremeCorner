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
  },
  {
    id: 'user-4',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'trainer'
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
    instructorId: 'user-4',
    instructorName: 'Mike Johnson',
    status: 'active',
    thumbnail: null,
    images: [],
    videos: [],
    documents: [],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Tools',
        description: 'Learn about the basic tools needed',
        duration: 15,
        order: 1
      },
      {
        id: 'lesson-2',
        title: 'Basic Techniques',
        description: 'Master the fundamental techniques',
        duration: 30,
        order: 2
      }
    ],
    enrollments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-2',
    title: 'Advanced Pottery Techniques',
    description: 'Master advanced pottery and ceramic techniques',
    price: 199.99,
    level: 'advanced',
    duration: 180,
    instructorId: 'user-4',
    instructorName: 'Mike Johnson',
    status: 'active',
    thumbnail: null,
    images: [],
    videos: [],
    documents: [],
    lessons: [
      {
        id: 'lesson-3',
        title: 'Advanced Wheel Throwing',
        description: 'Learn advanced wheel throwing techniques',
        duration: 45,
        order: 1
      }
    ],
    enrollments: [],
    createdAt: new Date().toISOString()
  }
];

// Mock enrollments database
const enrollments = [
  {
    id: 'enrollment-1',
    courseId: 'course-1',
    studentId: 'user-1',
    studentName: 'John Doe',
    status: 'enrolled',
    progress: 0,
    completedLessons: [],
    enrolledAt: new Date().toISOString()
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

// Product management (Artisan and Admin)
app.post('/api/products', authenticateToken, requireRole(['artisan', 'admin']), (req, res) => {
  const { name, description, price, stock, material, dimensions, color, style, artisanId } = req.body;
  
  // Admin can assign artisanId, otherwise use current user
  const productArtisanId = req.user.role === 'admin' && artisanId ? artisanId : req.user.id;
  const artisan = users.find(u => u.id === productArtisanId);
  
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
    artisanId: productArtisanId,
    artisanName: artisan ? `${artisan.firstName} ${artisan.lastName}` : 'Unknown',
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

// Course endpoints
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: {
      courses: courses,
      pagination: {
        page: 1,
        limit: 10,
        total: courses.length
      }
    }
  });
});

app.get('/api/courses/featured', (req, res) => {
  const featuredCourses = courses.filter(c => c.status === 'active').slice(0, 3);
  res.json({
    success: true,
    data: featuredCourses
  });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    data: course
  });
});

// Course management (Trainer and Admin)
app.post('/api/courses', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const { title, description, price, level, duration, instructorId } = req.body;
  
  // Admin can assign instructorId, otherwise use current user
  const courseInstructorId = req.user.role === 'admin' && instructorId ? instructorId : req.user.id;
  const instructor = users.find(u => u.id === courseInstructorId);
  
  const newCourse = {
    id: `course-${Date.now()}`,
    title,
    description,
    price: parseFloat(price),
    level: level || 'beginner',
    duration: parseInt(duration),
    instructorId: courseInstructorId,
    instructorName: instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown',
    status: 'active',
    thumbnail: null,
    images: [],
    videos: [],
    documents: [],
    lessons: [],
    enrollments: [],
    createdAt: new Date().toISOString()
  };
  
  courses.push(newCourse);
  
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
});

app.put('/api/courses/:id', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own courses'
    });
  }
  
  // Update course
  Object.assign(course, req.body);
  course.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
});

app.delete('/api/courses/:id', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const courseIndex = courses.findIndex(c => c.id === req.params.id);
  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  const course = courses[courseIndex];
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own courses'
    });
  }
  
  courses.splice(courseIndex, 1);
  
  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// Get trainer's courses
app.get('/api/courses/my-courses', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const userCourses = courses.filter(c => c.instructorId === req.user.id);
  
  res.json({
    success: true,
    data: {
      courses: userCourses,
      total: userCourses.length
    }
  });
});

// Get course enrollments (Trainer and Admin)
app.get('/api/courses/:id/enrollments', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only view enrollments for your own courses'
    });
  }
  
  const courseEnrollments = enrollments.filter(e => e.courseId === req.params.id);
  
  res.json({
    success: true,
    data: {
      enrollments: courseEnrollments,
      total: courseEnrollments.length
    }
  });
});

// Add lesson to course (Trainer and Admin)
app.post('/api/courses/:id/lessons', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only add lessons to your own courses'
    });
  }
  
  const { title, description, duration, order } = req.body;
  
  const newLesson = {
    id: `lesson-${Date.now()}`,
    title,
    description,
    duration: parseInt(duration),
    order: parseInt(order) || course.lessons.length + 1
  };
  
  course.lessons.push(newLesson);
  course.updatedAt = new Date().toISOString();
  
  res.status(201).json({
    success: true,
    message: 'Lesson added successfully',
    data: newLesson
  });
});

// Update lesson (Trainer and Admin)
app.put('/api/courses/:courseId/lessons/:lessonId', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const course = courses.find(c => c.id === req.params.courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update lessons in your own courses'
    });
  }
  
  const lesson = course.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }
  
  Object.assign(lesson, req.body);
  course.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Lesson updated successfully',
    data: lesson
  });
});

// Delete lesson (Trainer and Admin)
app.delete('/api/courses/:courseId/lessons/:lessonId', authenticateToken, requireRole(['trainer', 'admin']), (req, res) => {
  const course = courses.find(c => c.id === req.params.courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if trainer owns this course (unless admin)
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete lessons from your own courses'
    });
  }
  
  const lessonIndex = course.lessons.findIndex(l => l.id === req.params.lessonId);
  if (lessonIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }
  
  course.lessons.splice(lessonIndex, 1);
  course.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Lesson deleted successfully'
  });
});

// Course enrollment
app.post('/api/courses/:id/enroll', authenticateToken, (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Check if already enrolled
  const existingEnrollment = enrollments.find(e => e.courseId === req.params.id && e.studentId === req.user.id);
  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'You are already enrolled in this course'
    });
  }
  
  const newEnrollment = {
    id: `enrollment-${Date.now()}`,
    courseId: req.params.id,
    studentId: req.user.id,
    studentName: `${req.user.firstName} ${req.user.lastName}`,
    status: 'enrolled',
    progress: 0,
    completedLessons: [],
    enrolledAt: new Date().toISOString()
  };
  
  enrollments.push(newEnrollment);
  
  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    data: newEnrollment
  });
});

app.get('/api/courses/my-enrollments', authenticateToken, (req, res) => {
  const userEnrollments = enrollments.filter(e => e.studentId === req.user.id);
  
  // Add course details to enrollments
  const enrollmentsWithCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return {
      ...enrollment,
      course: course ? {
        title: course.title,
        description: course.description,
        instructorName: course.instructorName,
        thumbnail: course.thumbnail
      } : null
    };
  });
  
  res.json({
    success: true,
    data: {
      enrollments: enrollmentsWithCourses,
      total: enrollmentsWithCourses.length
    }
  });
});

app.put('/api/courses/enrollments/:enrollmentId/progress', authenticateToken, (req, res) => {
  const { lessonIndex, totalLessons } = req.body;
  const enrollment = enrollments.find(e => e.id === req.params.enrollmentId);
  
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  
  // Check if user owns this enrollment
  if (enrollment.studentId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own enrollment progress'
    });
  }
  
  enrollment.progress = Math.round((lessonIndex / totalLessons) * 100);
  enrollment.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Progress updated successfully',
    data: enrollment
  });
});

app.put('/api/courses/enrollments/:enrollmentId/complete-lesson', authenticateToken, (req, res) => {
  const { lessonId } = req.body;
  const enrollment = enrollments.find(e => e.id === req.params.enrollmentId);
  
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }
  
  // Check if user owns this enrollment
  if (enrollment.studentId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own enrollment progress'
    });
  }
  
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }
  
  enrollment.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Lesson marked as complete',
    data: enrollment
  });
});
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
