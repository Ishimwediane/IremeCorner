# IremeCorner Backend API

A comprehensive Node.js backend API for IremeCorner - a platform for handmade crafts and training courses.

## 🚀 Features

- **User Management**: Registration, authentication, profile management with role-based access
- **Product Management**: CRUD operations for handmade crafts with categories and inventory
- **Order Management**: Shopping cart, checkout, order tracking, and status updates
- **Course Management**: Training courses with enrollment, progress tracking, and certificates
- **Payment Processing**: WhatsApp integration for payment initiation and confirmation
- **File Upload**: Cloudinary integration for images, videos, and documents with automatic optimization
- **Email Notifications**: Automated emails for orders, enrollments, and system notifications
- **Analytics & Reporting**: Sales statistics and user analytics
- **Security**: JWT authentication, rate limiting, input validation, and CORS protection

### 💬 WhatsApp Payment System

Instead of traditional payment gateways, IremeCorner uses WhatsApp for a more personal payment experience:

- **Payment Initiation**: Generate WhatsApp links with pre-filled payment details
- **Manual Confirmation**: Business owners confirm payments through WhatsApp
- **Flexible Methods**: Supports bank transfer, mobile money, and cash payments
- **No Transaction Fees**: No payment gateway fees
- **Personal Touch**: Direct communication with customers

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with refresh tokens
- **Payments**: WhatsApp integration
- **File Upload**: Cloudinary with automatic optimization
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator

## 📁 Project Structure

```
src/
├── config/           # Database and app configuration
├── entities/         # TypeORM entities
│   ├── auth/        # User-related entities
│   ├── products/    # Product and category entities
│   ├── orders/      # Order and order item entities
│   ├── courses/     # Course and enrollment entities
│   ├── payments/    # Payment entities
│   └── notifications/ # Notification entities
├── controllers/      # Route controllers
├── services/         # Business logic services
├── routes/          # API routes
├── middleware/      # Custom middleware
│   ├── auth/       # Authentication middleware
│   ├── validation/ # Input validation
│   ├── error/      # Error handling
│   └── rateLimit/  # Rate limiting
├── utils/           # Utility functions
└── index.js        # Main application file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iremecorner-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=iremecorner_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRES_IN=30d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@iremecorner.com

   # Payment Configuration (WhatsApp)
   WHATSAPP_PHONE_NUMBER=+1234567890
   WHATSAPP_MESSAGE_TEMPLATE=Hello! I would like to make a payment for order {ORDER_NUMBER}. Amount: ${AMOUNT}

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=dfe7ue90j
   CLOUDINARY_API_KEY=623865115459183
   CLOUDINARY_API_SECRET=MPsMGN6Fc97CXafJSwrOg_Dwvj0

   # Other Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb iremecorner_db
   
   # The application will automatically create tables on first run
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/confirm-password-reset` - Confirm password reset

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Artisan only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/popular` - Get popular products
- `GET /api/products/new` - Get new products

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Course Endpoints

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor only)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/my-enrollments` - Get user's enrollments
- `PUT /api/courses/enrollments/:id/progress` - Update progress
- `POST /api/courses/:id/images` - Upload course images (Instructor only)
- `POST /api/courses/:id/videos` - Upload course videos (Instructor only)
- `POST /api/courses/:id/documents` - Upload course documents (Instructor only)
- `DELETE /api/courses/files/:publicId` - Delete course file (Instructor only)

### Payment Endpoints

- `POST /api/payments/order/:orderId` - Initiate order payment via WhatsApp
- `POST /api/payments/course/:courseId` - Initiate course payment via WhatsApp
- `POST /api/payments/:paymentId/confirm` - Confirm payment completion
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/:paymentId/refund` - Process refund
- `GET /api/payments/pending` - Get pending payments (Admin only)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **buyer**: Can purchase products and enroll in courses
- **artisan**: Can create and manage products, teach courses
- **student**: Can enroll in courses and track progress
- **admin**: Full access to all features and admin functions

## 📊 Database Schema

### Key Entities

- **Users**: User accounts with role-based access
- **Products**: Handmade crafts with inventory management
- **Categories**: Product and course categorization
- **Orders**: Order management with status tracking
- **OrderItems**: Individual items within orders
- **Courses**: Training courses with curriculum
- **Enrollments**: Student course enrollments with progress
- **Payments**: Payment processing and transaction history
- **Notifications**: System and user notifications

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers
- File upload validation

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure proper CORS origins
4. Set up SSL certificates
5. Configure production database
6. Set up email service
7. Configure WhatsApp phone number and message template
8. Set up file storage (AWS S3, Cloudinary, etc.)
9. Configure monitoring and logging

### Environment Variables

Ensure all required environment variables are set in production:

- Database credentials
- JWT secrets
- Email service credentials
- WhatsApp phone number and message template
- File upload configuration
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
