import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../types';

/**
 * Users controller
 */
export const UsersController = {
  /**
   * Get all users (admin only)
   * @route GET /api/users
   */
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await UsersService.getAllUsers(pagination);

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },

  /**
   * Get user by ID (admin only)
   * @route GET /api/users/:id
   */
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await UsersService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },

  /**
   * Create a new user (admin only)
   * @route POST /api/users
   */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UsersService.createUser(req.body);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },

  /**
   * Update a user (admin only)
   * @route PUT /api/users/:id
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await UsersService.updateUser(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },

  /**
   * Delete a user (admin only)
   * @route DELETE /api/users/:id
   */
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await UsersService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
      return undefined;
    }
  },

  /**
   * Get user addresses
   * @route GET /api/users/addresses
   */
  getUserAddresses: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await UsersService.getUserAddresses(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Addresses retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get address by ID
   * @route GET /api/users/addresses/:id
   */
  getAddressById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const result = await UsersService.getAddressById(id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Address retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new address
   * @route POST /api/users/addresses
   */
  createAddress: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await UsersService.createAddress(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an address
   * @route PUT /api/users/addresses/:id
   */
  updateAddress: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const result = await UsersService.updateAddress(id, req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an address
   * @route DELETE /api/users/addresses/:id
   */
  deleteAddress: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      await UsersService.deleteAddress(id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user wishlist
   * @route GET /api/users/wishlist
   */
  getUserWishlist: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await UsersService.getUserWishlist(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add product to wishlist
   * @route POST /api/users/wishlist
   */
  addToWishlist: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
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

      res.status(200).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove product from wishlist
   * @route DELETE /api/users/wishlist/:productId
   */
  removeFromWishlist: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { productId } = req.params;
      await UsersService.removeFromWishlist(req.user.id, productId);

      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Clear wishlist
   * @route DELETE /api/users/wishlist
   */
  clearWishlist: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      await UsersService.clearWishlist(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Wishlist cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
