import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (admin only)
router.get('/', authenticate, authorize(['ADMIN']), UsersController.getAllUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), UsersController.getUserById);
router.post('/', authenticate, authorize(['ADMIN']), UsersController.createUser);
router.put('/:id', authenticate, authorize(['ADMIN']), UsersController.updateUser);
router.delete('/:id', authenticate, authorize(['ADMIN']), UsersController.deleteUser);

// Protected routes (authenticated users)
router.get('/addresses', authenticate, UsersController.getUserAddresses);
router.get('/addresses/:id', authenticate, UsersController.getAddressById);
router.post('/addresses', authenticate, UsersController.createAddress);
router.put('/addresses/:id', authenticate, UsersController.updateAddress);
router.delete('/addresses/:id', authenticate, UsersController.deleteAddress);

// Wishlist routes
router.get('/wishlist', authenticate, UsersController.getUserWishlist);
router.post('/wishlist', authenticate, UsersController.addToWishlist);
router.delete('/wishlist/:productId', authenticate, UsersController.removeFromWishlist);
router.delete('/wishlist', authenticate, UsersController.clearWishlist);

export default router;
