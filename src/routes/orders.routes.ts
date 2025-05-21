import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (authenticated users)
router.get('/my-orders', authenticate, OrdersController.getUserOrders);
router.post('/', authenticate, OrdersController.createOrder);
router.post('/:id/cancel', authenticate, OrdersController.cancelOrder);

// Protected routes (admin only)
router.get('/', authenticate, authorize(['ADMIN']), OrdersController.getAllOrders);
router.put('/:id', authenticate, authorize(['ADMIN']), OrdersController.updateOrder);

// Mixed access routes (authenticated users can access their own orders, admins can access all)
router.get('/:id', authenticate, OrdersController.getOrderById);
router.get('/number/:orderNumber', authenticate, OrdersController.getOrderByOrderNumber);

export default router;
