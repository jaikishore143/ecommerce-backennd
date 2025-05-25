import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

/**
 * Authentication controller
 */
export const AuthController = {
  /**
   * Register a new user
   * @route POST /api/auth/register
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login a user
   * @route POST /api/auth/login
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Google OAuth login
   * @route POST /api/auth/google
   */
  googleLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.googleLogin(req.body);

      res.status(200).json({
        success: true,
        message: 'Google login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh access token
   * @route POST /api/auth/refresh-token
   */
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.refreshToken(req.body);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logout a user
   * @route POST /api/auth/logout
   */
  logout: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      await AuthService.logout(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Change user password
   * @route POST /api/auth/change-password
   */
  changePassword: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      await AuthService.changePassword(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user
   * @route GET /api/auth/me
   */
  getCurrentUser: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
