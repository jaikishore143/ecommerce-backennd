import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Cart service for managing user cart operations
 */
export const CartService = {
  /**
   * Get user cart with items
   */
  getUserCart: async (userId: string) => {
    // First, ensure user has a cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  },

  /**
   * Add item to cart
   */
  addToCart: async (userId: string, productId: string, quantity: number) => {
    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      });
      return updatedItem;
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
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
      return newItem;
    }
  },

  /**
   * Update cart item quantity
   */
  updateCartItemQuantity: async (userId: string, productId: string, quantity: number) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
      return null;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
    });

    return updatedItem;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (userId: string, productId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { success: true };
  },

  /**
   * Clear user cart
   */
  clearCart: async (userId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { success: true };
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  },

  /**
   * Get cart item count
   */
  getCartItemCount: async (userId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return 0;
    }

    return cart.items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
  },
};
