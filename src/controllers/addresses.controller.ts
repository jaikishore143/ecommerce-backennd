import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../types';
import { controllerWrapper } from '../utils/controller.utils';

/**
 * Addresses controller
 */
export const AddressesController = {
  /**
   * Get user addresses
   * @route GET /api/addresses
   */
  getUserAddresses: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const result = await UsersService.getUserAddresses(req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: result,
    });
  }),

  /**
   * Get address by ID
   * @route GET /api/addresses/:id
   */
  getAddressById: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const { id } = req.params;
    const result = await UsersService.getAddressById(id, req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Address retrieved successfully',
      data: result,
    });
  }),

  /**
   * Create a new address
   * @route POST /api/addresses
   */
  createAddress: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const result = await UsersService.createAddress(req.user.id, req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: result,
    });
  }),

  /**
   * Update an address
   * @route PUT /api/addresses/:id
   */
  updateAddress: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const { id } = req.params;
    const result = await UsersService.updateAddress(id, req.user.id, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: result,
    });
  }),

  /**
   * Delete an address
   * @route DELETE /api/addresses/:id
   */
  deleteAddress: controllerWrapper<AuthenticatedRequest>(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    
    const { id } = req.params;
    await UsersService.deleteAddress(id, req.user.id);
    
    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  }),
};
