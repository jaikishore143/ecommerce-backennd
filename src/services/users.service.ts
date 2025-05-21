import prisma from '../lib/prisma';
import { ApiError } from '../middleware/error.middleware';
import { hashPassword } from '../utils/password.utils';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../types/user.types';
import { PaginationParams, PaginatedResponse } from '../types';

/**
 * Users service
 */
export const UsersService = {
  /**
   * Get all users with pagination
   */
  getAllUsers: async (
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<UserResponse>> => {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Count total users
    const total = await prisma.user.count();

    // Get users
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      items: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<UserResponse> => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  },

  /**
   * Create a new user
   */
  createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  /**
   * Update a user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<UserResponse> => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError('User not found', 404);
    }

    // Check if email is already used by another user
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (userWithEmail) {
        throw new ApiError('Email is already in use', 400);
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: data.isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Get user addresses
   */
  getUserAddresses: async (userId: string): Promise<any[]> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Get addresses
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return addresses;
  },

  /**
   * Get address by ID
   */
  getAddressById: async (id: string, userId: string): Promise<any> => {
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new ApiError('Address not found', 404);
    }

    return address;
  },

  /**
   * Create a new address
   */
  createAddress: async (userId: string, data: CreateAddressRequest): Promise<any> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // If this is the default address, unset other default addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        userId,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault || false,
      },
    });

    return address;
  },

  /**
   * Update an address
   */
  updateAddress: async (id: string, userId: string, data: UpdateAddressRequest): Promise<any> => {
    // Check if address exists
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAddress) {
      throw new ApiError('Address not found', 404);
    }

    // If this is the default address, unset other default addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Update address
    const address = await prisma.address.update({
      where: { id },
      data: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault,
      },
    });

    return address;
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string, userId: string): Promise<void> => {
    // Check if address exists
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new ApiError('Address not found', 404);
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    });

    // If this was the default address, set another address as default
    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }
  },

  /**
   * Get user wishlist
   */
  getUserWishlist: async (userId: string): Promise<any[]> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Get wishlist items
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wishlistItems;
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (userId: string, productId: string): Promise<any> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return existingItem;
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
    });

    return wishlistItem;
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (userId: string, productId: string): Promise<void> => {
    // Check if wishlist item exists
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new ApiError('Product not found in wishlist', 404);
    }

    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },

  /**
   * Clear wishlist
   */
  clearWishlist: async (userId: string): Promise<void> => {
    // Delete all wishlist items for user
    await prisma.wishlistItem.deleteMany({
      where: { userId },
    });
  },
};
