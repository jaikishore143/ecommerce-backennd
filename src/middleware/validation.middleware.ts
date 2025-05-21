import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

/**
 * Validation middleware factory
 * @param schema - Validation schema function
 */
export const validate = (schema: (data: any) => { error?: any; value: any }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate request body
    const { error, value } = schema(req.body);
    
    if (error) {
      const message = error.details
        .map((detail: any) => detail.message)
        .join(', ');
      return next(new ApiError(`Validation error: ${message}`, 400, 'VALIDATION_ERROR'));
    }
    
    // Replace request body with validated value
    req.body = value;
    next();
  };
};
