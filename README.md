# Cricket Glow Express Backend

This is the backend API for the Cricket Glow Express e-commerce platform, built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- RESTful API with Express.js
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Role-based authorization
- CRUD operations for products, categories, orders, and users
- Error handling middleware
- Security features (CORS, Helmet, Rate Limiting)
- MVC architecture

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd cricket-glow-express/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cricket_glow_express?schema=public"

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

Replace the values with your own configuration.

### 4. Set up the database

Make sure your PostgreSQL server is running, then run the following commands to set up the database:

```bash
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

### 5. Start the development server

```bash
npm run dev
```

The server will start on http://localhost:5000 (or the port you specified in the .env file).

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/change-password` - Change user password
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/on-sale` - Get products on sale
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Subcategories

- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/:id` - Get subcategory by ID
- `GET /api/subcategories/slug/:slug` - Get subcategory by slug
- `POST /api/subcategories` - Create a new subcategory (admin only)
- `PUT /api/subcategories/:id` - Update a subcategory (admin only)
- `DELETE /api/subcategories/:id` - Delete a subcategory (admin only)

### Orders

- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/my-orders` - Get orders for current user
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/number/:orderNumber` - Get order by order number
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order (admin only)
- `POST /api/orders/:id/cancel` - Cancel an order

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Addresses

- `GET /api/users/addresses` - Get user addresses
- `GET /api/users/addresses/:id` - Get address by ID
- `POST /api/users/addresses` - Create a new address
- `PUT /api/users/addresses/:id` - Update an address
- `DELETE /api/users/addresses/:id` - Delete an address

### Wishlist

- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist` - Add product to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove product from wishlist
- `DELETE /api/users/wishlist` - Clear wishlist

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## License

This project is licensed under the MIT License.
