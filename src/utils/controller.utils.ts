import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Type for controller handlers that return a response or void
 */
export type ControllerHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<Response | undefined | void>;

/**
 * Wraps a controller method to ensure it returns void for Express compatibility
 * @param handler - The controller handler function
 * @returns A function that returns void
 */
export const controllerWrapper = <T extends Request = Request>(
  handler: ControllerHandler<T>
): RequestHandler => {
  return (req, res, next): void => {
    Promise.resolve(handler(req as T, res, next)).catch(next);
  };
};
