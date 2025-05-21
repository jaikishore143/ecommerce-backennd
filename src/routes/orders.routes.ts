import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { controllerWrapper } from '../utils/controller.utils';

const router = Router();

// Protected routes (authenticated users)
router.get('/my-orders', authenticate, controllerWrapper(OrdersController.getUserOrders));
router.post('/', authenticate, controllerWrapper(OrdersController.createOrder));
router.post('/:id/cancel', authenticate, controllerWrapper(OrdersController.cancelOrder));

// Protected routes (admin only)
router.get('/', authenticate, authorize(['ADMIN']), controllerWrapper(OrdersController.getAllOrders));
router.put('/:id', authenticate, authorize(['ADMIN']), controllerWrapper(OrdersController.updateOrder));

// Mixed access routes (authenticated users can access their own orders, admins can access all)
router.get('/:id', authenticate, controllerWrapper(OrdersController.getOrderById));
router.get('/number/:orderNumber', authenticate, controllerWrapper(OrdersController.getOrderByOrderNumber));

export default router;
