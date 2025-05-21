import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../services/products.service';
import { ProductFilters } from '../types/product.types';

/**
 * Products controller
 */
export const ProductsController = {
  /**
   * Get all products
   * @route GET /api/products
   */
  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page, 
        limit, 
        categoryId, 
        subcategoryId, 
        minPrice, 
        maxPrice, 
        brands, 
        inStock, 
        onSale, 
        tags, 
        search 
      } = req.query;

      // Parse pagination
      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      // Parse filters
      const filters: ProductFilters = {};
      
      if (categoryId) filters.categoryId = categoryId as string;
      if (subcategoryId) filters.subcategoryId = subcategoryId as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (brands) filters.brands = (brands as string).split(',');
      if (inStock) filters.inStock = inStock === 'true';
      if (onSale) filters.onSale = onSale === 'true';
      if (tags) filters.tags = (tags as string).split(',');
      if (search) filters.search = search as string;

      const result = await ProductsService.getAllProducts(filters, pagination);
      
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get product by ID
   * @route GET /api/products/:id
   */
  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await ProductsService.getProductById(id);
      
      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new product
   * @route POST /api/products
   */
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductsService.createProduct(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a product
   * @route PUT /api/products/:id
   */
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await ProductsService.updateProduct(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a product
   * @route DELETE /api/products/:id
   */
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await ProductsService.deleteProduct(id);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get featured products
   * @route GET /api/products/featured
   */
  getFeaturedProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.query;
      const result = await ProductsService.getFeaturedProducts(
        limit ? parseInt(limit as string) : undefined
      );
      
      res.status(200).json({
        success: true,
        message: 'Featured products retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get new arrivals
   * @route GET /api/products/new-arrivals
   */
  getNewArrivals: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.query;
      const result = await ProductsService.getNewArrivals(
        limit ? parseInt(limit as string) : undefined
      );
      
      res.status(200).json({
        success: true,
        message: 'New arrivals retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get products on sale
   * @route GET /api/products/on-sale
   */
  getProductsOnSale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.query;
      const result = await ProductsService.getProductsOnSale(
        limit ? parseInt(limit as string) : undefined
      );
      
      res.status(200).json({
        success: true,
        message: 'Products on sale retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get related products
   * @route GET /api/products/:id/related
   */
  getRelatedProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const result = await ProductsService.getRelatedProducts(
        id,
        limit ? parseInt(limit as string) : undefined
      );
      
      res.status(200).json({
        success: true,
        message: 'Related products retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
