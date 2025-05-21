import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import ordersRoutes from './orders.routes';
import usersRoutes from './users.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/', categoriesRoutes); // Categories and subcategories routes
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);

export default router;
