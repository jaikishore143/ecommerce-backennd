import swaggerJsdoc from 'swagger-jsdoc';
import config from './index';

// Define schemas separately for better organization
const schemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      role: { type: 'string', enum: ['CUSTOMER', 'ADMIN'], example: 'CUSTOMER' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Product: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '1' },
      name: { type: 'string', example: 'Pro Cricket Bat - English Willow' },
      description: { type: 'string', example: 'Professional grade English willow bat with premium grip' },
      price: { type: 'number', example: 299.99 },
      salePrice: { type: 'number', example: 249.99 },
      categoryId: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      subcategoryId: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      brand: { type: 'string', example: 'CricketPro' },
      stock: { type: 'integer', example: 10 },
      images: {
        type: 'array',
        items: { type: 'string' },
        example: ['/images/products/bat1.jpg', '/images/products/bat2.jpg']
      },
      featured: { type: 'boolean', example: true },
      onSale: { type: 'boolean', example: true },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['bat', 'willow', 'professional']
      }
    }
  },
  Category: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      name: { type: 'string', example: 'Bats' },
      description: { type: 'string', example: 'Cricket bats of all types' },
      slug: { type: 'string', example: 'bats' },
      image: { type: 'string', example: '/images/categories/bats.jpg' }
    }
  },
  Order: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      orderNumber: { type: 'string', example: 'ORD-12345' },
      userId: { type: 'string', example: '7d69c34c-5699-4574-8513-e5a2d3cf93d8' },
      status: { type: 'string', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], example: 'PENDING' },
      total: { type: 'number', example: 499.99 },
      items: { type: 'array', items: { type: 'object' } }
    }
  },
  Error: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error message' },
      error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Detailed error message' },
          code: { type: 'string', example: 'ERROR_CODE' }
        }
      }
    }
  }
};

// Define common responses
const responses = {
  UnauthorizedError: {
    description: 'Access token is missing or invalid',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
  },
  NotFoundError: {
    description: 'Resource not found',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
  },
  ValidationError: {
    description: 'Validation error',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
  }
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cricket Glow Express API',
      version: '1.0.0',
      description: 'API documentation for Cricket Glow Express e-commerce platform',
      contact: { name: 'API Support', email: 'support@cricketglow.com' }
    },
    servers: [{ url: `http://localhost:${config.port}/api`, description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas,
      responses
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
