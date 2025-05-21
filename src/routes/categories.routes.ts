import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Categories routes
router.get('/categories', CategoriesController.getAllCategories);
router.get('/categories/:id', CategoriesController.getCategoryById);
router.get('/categories/slug/:slug', CategoriesController.getCategoryBySlug);

// Protected category routes (admin only)
router.post('/categories', authenticate, authorize(['ADMIN']), CategoriesController.createCategory);
router.put('/categories/:id', authenticate, authorize(['ADMIN']), CategoriesController.updateCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), CategoriesController.deleteCategory);

// Subcategories routes
router.get('/subcategories', CategoriesController.getAllSubcategories);
router.get('/subcategories/:id', CategoriesController.getSubcategoryById);
router.get('/subcategories/slug/:slug', CategoriesController.getSubcategoryBySlug);

// Protected subcategory routes (admin only)
router.post('/subcategories', authenticate, authorize(['ADMIN']), CategoriesController.createSubcategory);
router.put('/subcategories/:id', authenticate, authorize(['ADMIN']), CategoriesController.updateSubcategory);
router.delete('/subcategories/:id', authenticate, authorize(['ADMIN']), CategoriesController.deleteSubcategory);

export default router;
