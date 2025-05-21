import prisma from '../lib/prisma';
import { ApiError } from '../middleware/error.middleware';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
} from '../types/product.types';
import { PaginationParams, PaginatedResponse } from '../types';

/**
 * Products service
 */
export const ProductsService = {
  /**
   * Get all products with pagination and filtering
   */
  getAllProducts: async (
    filters: ProductFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ProductResponse>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.subcategoryId) {
      where.subcategoryId = filters.subcategoryId;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.OR = [
        {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
        {
          salePrice: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      ];
    }

    if (filters.brands && filters.brands.length > 0) {
      where.brand = { in: filters.brands };
    }

    if (filters.inStock) {
      where.stock = { gt: 0 };
    }

    if (filters.onSale) {
      where.salePrice = { not: null };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.tags && filters.tags.length > 0) {
      where.productTags = {
        some: {
          tag: {
            name: { in: filters.tags },
          },
        },
      };
    }

    // Count total products
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products
    const transformedProducts = products.map((product) => ({
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    }));

    return {
      items: transformedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<ProductResponse> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
    });

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Transform product
    return {
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    };
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    // Check if subcategory exists if provided
    if (data.subcategoryId) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: data.subcategoryId },
      });

      if (!subcategory) {
        throw new ApiError('Subcategory not found', 404);
      }
    }

    // Create product transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create product
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice,
          stock: data.stock,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId,
          brand: data.brand,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      // Add images if provided
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url, index) => ({
            url,
            productId: newProduct.id,
            isMain: index === 0, // First image is main
          })),
        });
      }

      // Add tags if provided
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          // Find or create tag
          let tag = await tx.tag.findUnique({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await tx.tag.create({
              data: { name: tagName },
            });
          }

          // Create product tag relation
          await tx.productTag.create({
            data: {
              productId: newProduct.id,
              tagId: tag.id,
            },
          });
        }
      }

      // Add specifications if provided
      if (data.specifications && data.specifications.length > 0) {
        await tx.specification.createMany({
          data: data.specifications.map((spec) => ({
            key: spec.key,
            value: spec.value,
            productId: newProduct.id,
          })),
        });
      }

      return newProduct;
    });

    // Get complete product with all relations
    return this.getProductById(product.id);
  },

  /**
   * Update a product
   */
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new ApiError('Product not found', 404);
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

    // Check if subcategory exists if provided
    if (data.subcategoryId) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: data.subcategoryId },
      });

      if (!subcategory) {
        throw new ApiError('Subcategory not found', 404);
      }
    }

    // Update product transaction
    await prisma.$transaction(async (tx) => {
      // Update product
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice,
          stock: data.stock,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId,
          brand: data.brand,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
        },
      });

      // Update images if provided
      if (data.images) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        // Add new images
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((url, index) => ({
              url,
              productId: id,
              isMain: index === 0, // First image is main
            })),
          });
        }
      }

      // Update tags if provided
      if (data.tags) {
        // Delete existing product tags
        await tx.productTag.deleteMany({
          where: { productId: id },
        });

        // Add new tags
        if (data.tags.length > 0) {
          for (const tagName of data.tags) {
            // Find or create tag
            let tag = await tx.tag.findUnique({
              where: { name: tagName },
            });

            if (!tag) {
              tag = await tx.tag.create({
                data: { name: tagName },
              });
            }

            // Create product tag relation
            await tx.productTag.create({
              data: {
                productId: id,
                tagId: tag.id,
              },
            });
          }
        }
      }

      // Update specifications if provided
      if (data.specifications) {
        // Delete existing specifications
        await tx.specification.deleteMany({
          where: { productId: id },
        });

        // Add new specifications
        if (data.specifications.length > 0) {
          await tx.specification.createMany({
            data: data.specifications.map((spec) => ({
              key: spec.key,
              value: spec.value,
              productId: id,
            })),
          });
        }
      }
    });

    // Get updated product
    return this.getProductById(id);
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string): Promise<void> => {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Delete product (cascade will delete related entities)
    await prisma.product.delete({
      where: { id },
    });
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit: number = 8): Promise<ProductResponse[]> => {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      take: limit,
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products
    return products.map((product) => ({
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    }));
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (limit: number = 8): Promise<ProductResponse[]> => {
    const products = await prisma.product.findMany({
      where: { isNew: true },
      take: limit,
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products
    return products.map((product) => ({
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    }));
  },

  /**
   * Get products on sale
   */
  getProductsOnSale: async (limit: number = 8): Promise<ProductResponse[]> => {
    const products = await prisma.product.findMany({
      where: { salePrice: { not: null } },
      take: limit,
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products
    return products.map((product) => ({
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    }));
  },

  /**
   * Get related products
   */
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<ProductResponse[]> => {
    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Get product tags
    const tagIds = product.productTags.map((pt) => pt.tagId);

    // Find related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: productId },
        OR: [
          { categoryId: product.categoryId },
          {
            productTags: {
              some: {
                tagId: { in: tagIds },
              },
            },
          },
        ],
      },
      take: limit,
      include: {
        images: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform products
    return relatedProducts.map((product) => ({
      ...product,
      tags: product.productTags.map((pt) => pt.tag.name),
    }));
  },
};
