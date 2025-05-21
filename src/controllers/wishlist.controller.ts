import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../types';
import { controllerWrapper } from '../utils/controller.utils';

/**
 * Wishlist controller
 */
export const WishlistController = {
  /**
   * Get user wishlist
   * @route GET /api/wishlist
   */
  getUserWishlist: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const result = await UsersService.getUserWishlist(req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: result,
    });
  }),

  /**
   * Add product to wishlist
   * @route POST /api/wishlist
   */
  addToWishlist: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }
    
    const result = await UsersService.addToWishlist(req.user.id, productId);
    
    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: result,
    });
  }),

  /**
   * Remove product from wishlist
   * @route DELETE /api/wishlist/:productId
   */
  removeFromWishlist: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const { productId } = req.params;
    await UsersService.removeFromWishlist(req.user.id, productId);
    
    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
    });
  }),

  /**
   * Clear wishlist
   * @route DELETE /api/wishlist
   */
  clearWishlist: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    await UsersService.clearWishlist(req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
    });
  }),
};
