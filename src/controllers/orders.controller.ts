import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '../services/orders.service';
import { AuthenticatedRequest } from '../types';

/**
 * Orders controller
 */
export const OrdersController = {
  /**
   * Get all orders (admin only)
   * @route GET /api/orders
   */
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query;
      
      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };
      
      const result = await OrdersService.getAllOrders(pagination);
      
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get orders for current user
   * @route GET /api/orders/my-orders
   */
  getUserOrders: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      
      const { page, limit } = req.query;
      
      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };
      
      const result = await OrdersService.getUserOrders(req.user.id, pagination);
      
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order by ID
   * @route GET /api/orders/:id
   */
  getOrderById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await OrdersService.getOrderById(id);
      
      // Check if user is authorized to view this order
      if (req.user?.role !== 'ADMIN' && result.userId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order by order number
   * @route GET /api/orders/number/:orderNumber
   */
  getOrderByOrderNumber: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderNumber } = req.params;
      const result = await OrdersService.getOrderByOrderNumber(orderNumber);
      
      // Check if user is authorized to view this order
      if (req.user?.role !== 'ADMIN' && result.userId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new order
   * @route POST /api/orders
   */
  createOrder: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      
      const result = await OrdersService.createOrder(req.user.id, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an order (admin only)
   * @route PUT /api/orders/:id
   */
  updateOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await OrdersService.updateOrder(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel an order
   * @route POST /api/orders/:id/cancel
   */
  cancelOrder: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Get order to check ownership
      const order = await OrdersService.getOrderById(id);
      
      // Check if user is authorized to cancel this order
      if (req.user?.role !== 'ADMIN' && order.userId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
      
      const result = await OrdersService.cancelOrder(id);
      
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
