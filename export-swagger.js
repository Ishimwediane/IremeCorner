import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IremeCorner API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce and learning management system API',
      contact: {
        name: 'API Support',
        email: 'api-support@iremecorner.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.iremecorner.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['student', 'artisan', 'admin'],
              description: 'User role'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Email verification status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Product unique identifier'
            },
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Product price'
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' }
              }
            },
            artisan: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' }
              }
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              description: 'Product image URLs'
            },
            isActive: {
              type: 'boolean',
              description: 'Product availability status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Category unique identifier'
            },
            name: {
              type: 'string',
              description: 'Category name'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            type: {
              type: 'string',
              enum: ['product', 'course'],
              description: 'Category type'
            },
            isActive: {
              type: 'boolean',
              description: 'Category status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Order unique identifier'
            },
            orderNumber: {
              type: 'string',
              description: 'Order number'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status'
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              description: 'Total order amount'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  quantity: { type: 'integer' },
                  price: { type: 'number', format: 'float' },
                  subtotal: { type: 'number', format: 'float' }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            paymentMethod: {
              type: 'string',
              enum: ['card', 'paypal', 'bank_transfer'],
              description: 'Payment method'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Course unique identifier'
            },
            title: {
              type: 'string',
              description: 'Course title'
            },
            description: {
              type: 'string',
              description: 'Course description'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Course price'
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' }
              }
            },
            instructor: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' }
              }
            },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              description: 'Course difficulty level'
            },
            duration: {
              type: 'integer',
              description: 'Course duration in minutes'
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Course rating'
            },
            enrollmentCount: {
              type: 'integer',
              description: 'Number of enrolled students'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Assignment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Assignment unique identifier'
            },
            title: {
              type: 'string',
              description: 'Assignment title'
            },
            description: {
              type: 'string',
              description: 'Assignment description'
            },
            instructions: {
              type: 'string',
              description: 'Assignment instructions'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Assignment due date'
            },
            maxPoints: {
              type: 'integer',
              description: 'Maximum points for assignment'
            },
            type: {
              type: 'string',
              enum: ['assignment', 'quiz', 'project'],
              description: 'Assignment type'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Certificate: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Certificate unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            courseId: {
              type: 'string',
              format: 'uuid',
              description: 'Course ID'
            },
            grade: {
              type: 'string',
              description: 'Grade received'
            },
            issuedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Issue date'
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              description: 'Expiry date'
            },
            isRevoked: {
              type: 'boolean',
              description: 'Revocation status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/auth/authRoutes.js',
    './src/routes/products/productRoutes.js',
    './src/routes/categories/categoryRoutes.js',
    './src/routes/orders/orderRoutes.js',
    './src/routes/courses/courseRoutes.js',
    './src/routes/courses/assignmentRoutes.js',
    './src/routes/courses/certificateRoutes.js',
    './src/routes/payments/paymentRoutes.js',
    './src/routes/inventory/inventoryRoutes.js'
  ]
};

try {
  console.log('🔄 Generating Swagger documentation...');
  
  const specs = swaggerJsdoc(options);
  
  // Write to swagger.json file
  const outputPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  
  console.log('✅ Swagger documentation exported successfully!');
  console.log(`📄 File saved to: ${outputPath}`);
  console.log(`📊 Total endpoints documented: ${Object.keys(specs.paths || {}).length}`);
  
  // Also create a pretty-printed version
  const prettyOutputPath = path.join(process.cwd(), 'swagger-pretty.json');
  fs.writeFileSync(prettyOutputPath, JSON.stringify(specs, null, 4));
  
  console.log(`📄 Pretty version saved to: ${prettyOutputPath}`);
  
} catch (error) {
  console.error('❌ Error generating Swagger documentation:', error.message);
  process.exit(1);
}
