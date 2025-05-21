import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', ProductsController.getAllProducts);
router.get('/featured', ProductsController.getFeaturedProducts);
router.get('/new-arrivals', ProductsController.getNewArrivals);
router.get('/on-sale', ProductsController.getProductsOnSale);
router.get('/:id', ProductsController.getProductById);
router.get('/:id/related', ProductsController.getRelatedProducts);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['ADMIN']), ProductsController.createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), ProductsController.updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), ProductsController.deleteProduct);

export default router;
