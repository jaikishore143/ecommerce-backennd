import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { controllerWrapper } from '../utils/controller.utils';

const router = Router();

// Protected routes (admin only)
router.get('/', authenticate, authorize(['ADMIN']), controllerWrapper(UsersController.getAllUsers));
router.get('/:id', authenticate, authorize(['ADMIN']), controllerWrapper(UsersController.getUserById));
router.post('/', authenticate, authorize(['ADMIN']), controllerWrapper(UsersController.createUser));
router.put('/:id', authenticate, authorize(['ADMIN']), controllerWrapper(UsersController.updateUser));
router.delete('/:id', authenticate, authorize(['ADMIN']), controllerWrapper(UsersController.deleteUser));

export default router;
