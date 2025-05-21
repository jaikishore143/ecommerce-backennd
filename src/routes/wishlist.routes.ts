import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Wishlist routes (authenticated users)
router.get('/', authenticate, WishlistController.getUserWishlist);
router.post('/', authenticate, WishlistController.addToWishlist);
router.delete('/:productId', authenticate, WishlistController.removeFromWishlist);
router.delete('/', authenticate, WishlistController.clearWishlist);

export default router;
