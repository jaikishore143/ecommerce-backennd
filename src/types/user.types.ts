import { Role } from '@prisma/client';

// User types
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Address types
export interface CreateAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string | null;
  isDefault?: boolean;
}
