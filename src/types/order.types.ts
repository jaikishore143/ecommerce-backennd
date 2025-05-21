import { OrderStatus, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Order types
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddressId?: string;
  paymentMethod?: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingAddressId?: string | null;
  paymentMethod?: string | null;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: {
    id: string;
    productId: string;
    name: string;
    price: Decimal;
    salePrice?: Decimal | null;
    quantity: number;
  }[];
  subtotal: Decimal;
  tax: Decimal;
  shipping: Decimal;
  total: Decimal;
  shippingAddress?: {
    id: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string | null;
  } | null;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
