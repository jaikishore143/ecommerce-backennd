import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import ordersRoutes from './orders.routes';
import usersRoutes from './users.routes';
import addressesRoutes from './addresses.routes';
import wishlistRoutes from './wishlist.routes';
import cartRoutes from './cart.routes';

const router = Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cricket Glow Express API',
    version: '1.0.0',
    endpoints: [
      '/auth',
      '/products',
      '/categories',
      '/subcategories',
      '/orders',
      '/users',
      '/addresses',
      '/wishlist',
      '/cart'
    ]
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/', categoriesRoutes); // Categories and subcategories routes
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/addresses', addressesRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/cart', cartRoutes);

export default router;
