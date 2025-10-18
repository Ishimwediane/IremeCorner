# IremeCorner API Documentation

## Overview
The IremeCorner API is a comprehensive e-commerce and learning management system that provides endpoints for authentication, product management, order processing, course management, and more.

**Base URL:** `http://localhost:5000/api`

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Categories](#categories)
4. [Products](#products)
5. [Orders](#orders)
6. [Courses](#courses)
7. [Assignments](#assignments)
8. [Certificates](#certificates)
9. [Payments](#payments)
10. [Inventory](#inventory)
11. [Error Handling](#error-handling)

---

## Authentication

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 characters)",
  "role": "string (required, enum: ['student', 'artisan', 'admin'])",
  "phone": "string (optional, 10-15 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "isEmailVerified": false,
      "createdAt": "ISO date"
    }
  }
}
```

### Login User
**POST** `/auth/login`

Authenticates a user and returns access token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

### Get User Profile
**GET** `/auth/profile`

Retrieves the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "phone": "string",
      "isEmailVerified": boolean,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

### Update User Profile
**PUT** `/auth/profile`

Updates the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional, 10-15 characters)"
}
```

### Refresh Token
**POST** `/auth/refresh`

Refreshes the access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

### Request Password Reset
**POST** `/auth/forgot-password`

Sends password reset email.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

### Reset Password
**POST** `/auth/reset-password`

Resets password using reset token.

**Request Body:**
```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 characters)"
}
```

---

## User Management

### Get All Users (Admin)
**GET** `/auth/users`

Retrieves all users with pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Update User Role (Admin)
**PUT** `/auth/users/:id/role`

Updates a user's role.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "string (required, enum: ['student', 'artisan', 'admin'])"
}
```

---

## Categories

### Get All Categories
**GET** `/categories`

Retrieves all categories with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "type": "string",
        "isActive": boolean,
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### Get Category by ID
**GET** `/categories/:id`

Retrieves a specific category.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "type": "string",
      "isActive": boolean,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

### Create Category (Admin)
**POST** `/categories`

Creates a new category.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required, 3-100 characters)",
  "description": "string (required, 10-500 characters)",
  "type": "string (required, enum: ['product', 'course'])"
}
```

### Update Category (Admin)
**PUT** `/categories/:id`

Updates an existing category.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (optional, 3-100 characters)",
  "description": "string (optional, 10-500 characters)",
  "isActive": boolean (optional)
}
```

### Delete Category (Admin)
**DELETE** `/categories/:id`

Deletes a category.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## Products

### Get All Products
**GET** `/products`

Retrieves all products with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Category ID filter
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "price": number,
        "category": {
          "id": "uuid",
          "name": "string"
        },
        "artisan": {
          "id": "uuid",
          "firstName": "string",
          "lastName": "string"
        },
        "images": ["string"],
        "isActive": boolean,
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### Get Product by ID
**GET** `/products/:id`

Retrieves a specific product.

### Create Product (Artisan)
**POST** `/products`

Creates a new product.

**Headers:**
```
Authorization: Bearer <artisan_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required, 3-200 characters)",
  "description": "string (required, 10-2000 characters)",
  "price": "number (required, min 0)",
  "categoryId": "uuid (required)",
  "stock": "number (optional, min 0)",
  "tags": ["string"] (optional)
}
```

### Update Product (Artisan)
**PUT** `/products/:id`

Updates an existing product.

**Headers:**
```
Authorization: Bearer <artisan_token>
Content-Type: application/json
```

### Delete Product (Artisan)
**DELETE** `/products/:id`

Deletes a product.

**Headers:**
```
Authorization: Bearer <artisan_token>
```

### Get All Products (Admin)
**GET** `/products/admin/all`

Retrieves all products for admin management.

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Update Product Status (Admin)
**PUT** `/products/admin/:id/status`

Updates product status (active/inactive).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "isActive": boolean
}
```

---

## Orders

### Create Order
**POST** `/orders`

Creates a new order.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid (required)",
      "quantity": "number (required, min 1)",
      "price": "number (required)"
    }
  ],
  "shippingAddress": {
    "street": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "zipCode": "string (required)",
    "country": "string (required)"
  },
  "paymentMethod": "string (required, enum: ['card', 'paypal', 'bank_transfer'])"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "string",
      "status": "pending",
      "totalAmount": number,
      "items": [
        {
          "productId": "uuid",
          "quantity": number,
          "price": number,
          "subtotal": number
        }
      ],
      "shippingAddress": "object",
      "paymentMethod": "string",
      "createdAt": "ISO date"
    }
  }
}
```

### Get My Orders
**GET** `/orders/my-orders`

Retrieves authenticated user's orders.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Order status filter

### Get Order by ID
**GET** `/orders/:id`

Retrieves a specific order.

**Headers:**
```
Authorization: Bearer <user_token>
```

### Update Order Status (Admin)
**PUT** `/orders/:id/status`

Updates order status.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "string (required, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])"
}
```

### Get Order Statistics (Admin)
**GET** `/orders/statistics`

Retrieves order statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## Courses

### Get All Courses
**GET** `/courses`

Retrieves all courses with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "price": number,
        "category": {
          "id": "uuid",
          "name": "string"
        },
        "instructor": {
          "id": "uuid",
          "firstName": "string",
          "lastName": "string"
        },
        "level": "string",
        "duration": number,
        "rating": number,
        "enrollmentCount": number,
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### Get Featured Courses
**GET** `/courses/featured`

Retrieves featured courses.

### Get Popular Courses
**GET** `/courses/popular`

Retrieves popular courses.

### Get New Courses
**GET** `/courses/new`

Retrieves newest courses.

### Get Course by ID
**GET** `/courses/:id`

Retrieves a specific course.

### Create Course (Artisan)
**POST** `/courses`

Creates a new course.

**Headers:**
```
Authorization: Bearer <artisan_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required, 3-200 characters)",
  "description": "string (required, 20-2000 characters)",
  "price": "number (required, min 0)",
  "categoryId": "uuid (required)",
  "level": "string (optional, enum: ['beginner', 'intermediate', 'advanced'])",
  "duration": "number (optional, min 0)"
}
```

### Enroll in Course (Student)
**POST** `/courses/:id/enroll`

Enrolls in a course.

**Headers:**
```
Authorization: Bearer <student_token>
```

### Get My Enrollments (Student)
**GET** `/courses/my-enrollments`

Retrieves student's enrollments.

**Headers:**
```
Authorization: Bearer <student_token>
```

### Update Enrollment Progress (Student)
**PUT** `/courses/enrollments/:enrollmentId/progress`

Updates enrollment progress.

**Headers:**
```
Authorization: Bearer <student_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "progress": "number (required, 0-100)"
}
```

---

## Assignments

### Create Assignment (Instructor)
**POST** `/assignments/courses/:courseId`

Creates an assignment for a course.

**Headers:**
```
Authorization: Bearer <artisan_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string (required, 3-200 characters)",
  "description": "string (required, 10-2000 characters)",
  "instructions": "string (required, 10-5000 characters)",
  "dueDate": "string (required, ISO date)",
  "maxPoints": "number (required, 1-1000)",
  "type": "string (optional, enum: ['assignment', 'quiz', 'project'])"
}
```

### Submit Assignment (Student)
**POST** `/assignments/:assignmentId/submit`

Submits an assignment.

**Headers:**
```
Authorization: Bearer <student_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "submission": "string (required)",
  "notes": "string (optional)"
}
```

### Grade Assignment (Instructor)
**PUT** `/assignments/submissions/:submissionId/grade`

Grades an assignment submission.

**Headers:**
```
Authorization: Bearer <artisan_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "grade": "number (required, 0-maxPoints)",
  "feedback": "string (optional)"
}
```

---

## Certificates

### Get My Certificates (Student)
**GET** `/certificates/my-certificates`

Retrieves student's certificates.

**Headers:**
```
Authorization: Bearer <student_token>
```

### Issue Certificate (Admin)
**POST** `/certificates/issue`

Issues a certificate to a student.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid (required)",
  "courseId": "uuid (required)",
  "grade": "string (required)",
  "issuedDate": "string (required, ISO date)"
}
```

### Verify Certificate
**POST** `/certificates/verify`

Verifies a certificate (public endpoint).

**Request Body:**
```json
{
  "certificateId": "uuid (required)"
}
```

---

## Payments

### Process Payment
**POST** `/payments/process`

Processes a payment for an order.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "uuid (required)",
  "paymentMethod": "string (required, enum: ['card', 'paypal', 'bank_transfer'])",
  "amount": "number (required)",
  "currency": "string (required, default: 'USD')"
}
```

### Get Payment History
**GET** `/payments/history`

Retrieves user's payment history.

**Headers:**
```
Authorization: Bearer <user_token>
```

---

## Inventory

### Get Inventory Items
**GET** `/inventory`

Retrieves inventory items.

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Update Stock
**PUT** `/inventory/:productId/stock`

Updates product stock.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": "number (required)",
  "operation": "string (required, enum: ['add', 'subtract', 'set'])"
}
```

---

## Error Handling

### Error Response Format
All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message",
      "value": "invalidValue"
    }
  ],
  "statusCode": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Authentication Errors
- `401` - Invalid or missing token
- `403` - Insufficient permissions

### Validation Errors
- `422` - Request validation failed
- Check the `errors` array for specific field validation messages

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **General endpoints:** 100 requests per 15 minutes
- **Authentication endpoints:** 5 requests per 15 minutes
- **File upload endpoints:** 10 requests per 15 minutes

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## File Uploads

### Supported File Types
- **Images:** JPG, PNG, GIF, WebP
- **Videos:** MP4, WebM, MOV
- **Documents:** PDF, DOC, DOCX, TXT

### File Size Limits
- **Images:** 5MB per file
- **Videos:** 100MB per file
- **Documents:** 10MB per file

### Upload Endpoints
- **Product Images:** `POST /products/:id/images`
- **Course Thumbnails:** `POST /courses/:id/thumbnail`
- **Course Videos:** `POST /courses/:id/videos`
- **Course Documents:** `POST /courses/:id/documents`

---

## Webhooks

### Payment Webhooks
The API supports webhooks for payment processing:

**Endpoint:** `POST /webhooks/payments`

**Headers:**
```
Content-Type: application/json
X-Webhook-Signature: signature_hash
```

---

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install iremecorner-api-client
```

### Python
```bash
pip install iremecorner-api
```

### PHP
```bash
composer require iremecorner/api-client
```

---

## Support

For API support and questions:
- **Email:** api-support@iremecorner.com
- **Documentation:** https://docs.iremecorner.com
- **Status Page:** https://status.iremecorner.com

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication system
- Product management
- Order processing
- Course management
- Assignment system
- Certificate issuance
- Payment processing
- Inventory management

---

*Last updated: January 2024*
