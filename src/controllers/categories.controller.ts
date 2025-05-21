import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from '../services/categories.service';

/**
 * Categories controller
 */
export const CategoriesController = {
  /**
   * Get all categories
   * @route GET /api/categories
   */
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.getAllCategories();
      
      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get category by ID
   * @route GET /api/categories/:id
   */
  getCategoryById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.getCategoryById(id);
      
      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get category by slug
   * @route GET /api/categories/slug/:slug
   */
  getCategoryBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await CategoriesService.getCategoryBySlug(slug);
      
      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new category
   * @route POST /api/categories
   */
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.createCategory(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a category
   * @route PUT /api/categories/:id
   */
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.updateCategory(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a category
   * @route DELETE /api/categories/:id
   */
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await CategoriesService.deleteCategory(id);
      
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all subcategories
   * @route GET /api/subcategories
   */
  getAllSubcategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.getAllSubcategories();
      
      res.status(200).json({
        success: true,
        message: 'Subcategories retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get subcategory by ID
   * @route GET /api/subcategories/:id
   */
  getSubcategoryById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.getSubcategoryById(id);
      
      res.status(200).json({
        success: true,
        message: 'Subcategory retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get subcategory by slug
   * @route GET /api/subcategories/slug/:slug
   */
  getSubcategoryBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const result = await CategoriesService.getSubcategoryBySlug(slug);
      
      res.status(200).json({
        success: true,
        message: 'Subcategory retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new subcategory
   * @route POST /api/subcategories
   */
  createSubcategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CategoriesService.createSubcategory(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Subcategory created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a subcategory
   * @route PUT /api/subcategories/:id
   */
  updateSubcategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CategoriesService.updateSubcategory(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Subcategory updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a subcategory
   * @route DELETE /api/subcategories/:id
   */
  deleteSubcategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await CategoriesService.deleteSubcategory(id);
      
      res.status(200).json({
        success: true,
        message: 'Subcategory deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
