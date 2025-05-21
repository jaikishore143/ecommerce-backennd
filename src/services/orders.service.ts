import prisma from '../lib/prisma';
import { ApiError } from '../middleware/error.middleware';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderResponse,
  OrderItemRequest,
} from '../types/order.types';
import { PaginationParams, PaginatedResponse } from '../types';
import { OrderStatus, PaymentStatus } from '@prisma/client';

/**
 * Orders service
 */
export const OrdersService = {
  /**
   * Get all orders with pagination
   */
  getAllOrders: async (
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<OrderResponse>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Count total orders
    const total = await prisma.order.count();

    // Get orders
    const orders = await prisma.order.findMany({
      skip,
      take: limit,
      include: {
        items: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get orders for a user with pagination
   */
  getUserOrders: async (
    userId: string,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<OrderResponse>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Count total orders for user
    const total = await prisma.order.count({
      where: { userId },
    });

    // Get orders
    const orders = await prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        items: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<OrderResponse> => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    return order;
  },

  /**
   * Get order by order number
   */
  getOrderByOrderNumber: async (orderNumber: string): Promise<OrderResponse> => {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    return order;
  },

  /**
   * Create a new order
   */
  createOrder: async (userId: string, data: CreateOrderRequest): Promise<OrderResponse> => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Check if items are provided
    if (!data.items || data.items.length === 0) {
      throw new ApiError('Order must contain at least one item', 400);
    }

    // Check if shipping address exists if provided
    if (data.shippingAddressId) {
      const address = await prisma.address.findFirst({
        where: {
          id: data.shippingAddressId,
          userId,
        },
      });

      if (!address) {
        throw new ApiError('Shipping address not found', 404);
      }
    }

    // Create order transaction
    const order = await prisma.$transaction(async (tx) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Calculate order totals
      let subtotal = 0;
      const orderItems = [];

      // Process each order item
      for (const item of data.items) {
        // Get product
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new ApiError(`Product with ID ${item.productId} not found`, 404);
        }

        // Check stock
        if (product.stock < item.quantity) {
          throw new ApiError(
            `Not enough stock for product ${product.name}. Available: ${product.stock}`,
            400
          );
        }

        // Calculate item price
        const price = product.salePrice || product.price;
        const itemTotal = Number(price) * item.quantity;
        subtotal += itemTotal;

        // Add to order items
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          quantity: item.quantity,
        });

        // Update product stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });
      }

      // Calculate tax and shipping
      const tax = subtotal * 0.1; // 10% tax
      const shipping = subtotal > 99 ? 0 : 10; // Free shipping for orders over $99
      const total = subtotal + tax + shipping;

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: OrderStatus.PENDING,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddressId: data.shippingAddressId,
          paymentMethod: data.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      return newOrder;
    });

    return order;
  },

  /**
   * Update an order
   */
  updateOrder: async (id: string, data: UpdateOrderRequest): Promise<OrderResponse> => {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new ApiError('Order not found', 404);
    }

    // Update order
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        paymentStatus: data.paymentStatus,
        shippingAddressId: data.shippingAddressId,
        paymentMethod: data.paymentMethod,
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    return order;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: string): Promise<OrderResponse> => {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      throw new ApiError('Order not found', 404);
    }

    // Check if order can be cancelled
    if (
      existingOrder.status === OrderStatus.DELIVERED ||
      existingOrder.status === OrderStatus.CANCELLED
    ) {
      throw new ApiError(
        `Order cannot be cancelled because it is already ${existingOrder.status.toLowerCase()}`,
        400
      );
    }

    // Cancel order transaction
    const order = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      // Restore product stock
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return updatedOrder;
    });

    return order;
  },
};
