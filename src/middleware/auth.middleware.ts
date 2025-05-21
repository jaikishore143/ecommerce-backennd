import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthenticatedRequest } from '../types';
import { ApiError } from './error.middleware';
import prisma from '../lib/prisma';

/**
 * Authentication middleware
 * Verifies the JWT token and attaches the user to the request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized - No token provided', 401);
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new ApiError('Unauthorized - Invalid token', 401);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new ApiError('Unauthorized - User not found or inactive', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param roles - Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Unauthorized - User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Forbidden - User role ${req.user.role} not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};
