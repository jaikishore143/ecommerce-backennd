import { Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { AuthenticatedRequest } from '../types';
import { controllerWrapper } from '../utils/controller.utils';

/**
 * Cart controller
 */
export const CartController = {
  /**
   * Get user cart
   * @route GET /api/cart
   */
  getUserCart: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const cart = await CartService.getUserCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
    });
  }),

  /**
   * Add item to cart
   * @route POST /api/cart
   */
  addToCart: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0',
      });
    }

    const cartItem = await CartService.addToCart(req.user.id, productId, quantity);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem,
    });
  }),

  /**
   * Update cart item quantity
   * @route PUT /api/cart/:productId
   */
  updateCartItem: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity && quantity !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required',
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative',
      });
    }

    const cartItem = await CartService.updateCartItemQuantity(req.user.id, productId, quantity);

    return res.status(200).json({
      success: true,
      message: cartItem ? 'Cart item updated successfully' : 'Cart item removed successfully',
      data: cartItem,
    });
  }),

  /**
   * Remove item from cart
   * @route DELETE /api/cart/:productId
   */
  removeFromCart: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { productId } = req.params;

    const result = await CartService.removeFromCart(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: result,
    });
  }),

  /**
   * Clear cart
   * @route DELETE /api/cart
   */
  clearCart: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await CartService.clearCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: result,
    });
  }),

  /**
   * Get cart item count
   * @route GET /api/cart/count
   */
  getCartItemCount: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const count = await CartService.getCartItemCount(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Cart item count retrieved successfully',
      data: { count },
    });
  }),
};
