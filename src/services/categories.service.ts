import prisma from '../lib/prisma';
import { ApiError } from '../middleware/error.middleware';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
} from '../types/product.types';
import { PaginationParams, PaginatedResponse } from '../types';

/**
 * Categories service
 */
export const CategoriesService = {
  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<any[]> => {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<any> => {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    return category;
  },

  /**
   * Get category by slug
   */
  getCategoryBySlug: async (slug: string): Promise<any> => {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    return category;
  },

  /**
   * Create a new category
   */
  createCategory: async (data: CreateCategoryRequest): Promise<any> => {
    // Check if slug is already used
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new ApiError('Category with this slug already exists', 400);
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        slug: data.slug,
      },
      include: {
        subcategories: true,
      },
    });

    return category;
  },

  /**
   * Update a category
   */
  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<any> => {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new ApiError('Category not found', 404);
    }

    // Check if slug is already used by another category
    if (data.slug && data.slug !== existingCategory.slug) {
      const categoryWithSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (categoryWithSlug && categoryWithSlug.id !== id) {
        throw new ApiError('Category with this slug already exists', 400);
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        slug: data.slug,
      },
      include: {
        subcategories: true,
      },
    });

    return category;
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<void> => {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    // Delete category (cascade will delete subcategories)
    await prisma.category.delete({
      where: { id },
    });
  },

  /**
   * Get all subcategories
   */
  getAllSubcategories: async (): Promise<any[]> => {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return subcategories;
  },

  /**
   * Get subcategory by ID
   */
  getSubcategoryById: async (id: string): Promise<any> => {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!subcategory) {
      throw new ApiError('Subcategory not found', 404);
    }

    return subcategory;
  },

  /**
   * Get subcategory by slug
   */
  getSubcategoryBySlug: async (slug: string): Promise<any> => {
    const subcategory = await prisma.subcategory.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!subcategory) {
      throw new ApiError('Subcategory not found', 404);
    }

    return subcategory;
  },

  /**
   * Create a new subcategory
   */
  createSubcategory: async (data: CreateSubcategoryRequest): Promise<any> => {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    // Check if slug is already used
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { slug: data.slug },
    });

    if (existingSubcategory) {
      throw new ApiError('Subcategory with this slug already exists', 400);
    }

    // Create subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return subcategory;
  },

  /**
   * Update a subcategory
   */
  updateSubcategory: async (id: string, data: UpdateSubcategoryRequest): Promise<any> => {
    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      throw new ApiError('Subcategory not found', 404);
    }

    // Check if category exists if provided
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new ApiError('Category not found', 404);
      }
    }

    // Check if slug is already used by another subcategory
    if (data.slug && data.slug !== existingSubcategory.slug) {
      const subcategoryWithSlug = await prisma.subcategory.findUnique({
        where: { slug: data.slug },
      });

      if (subcategoryWithSlug && subcategoryWithSlug.id !== id) {
        throw new ApiError('Subcategory with this slug already exists', 400);
      }
    }

    // Update subcategory
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return subcategory;
  },

  /**
   * Delete a subcategory
   */
  deleteSubcategory: async (id: string): Promise<void> => {
    // Check if subcategory exists
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
    });

    if (!subcategory) {
      throw new ApiError('Subcategory not found', 404);
    }

    // Delete subcategory
    await prisma.subcategory.delete({
      where: { id },
    });
  },
};
