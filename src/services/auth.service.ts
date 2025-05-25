import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { ApiError } from '../middleware/error.middleware';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenPayload,
  RefreshTokenRequest,
  ChangePasswordRequest,
  GoogleLoginRequest
} from '../types/auth.types';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Authentication service
 */
export const AuthService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
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
        role: Role.CUSTOMER,
      },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  /**
   * Login a user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError('User account is inactive', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
    try {
      // Verify the Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: data.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiError('Invalid Google token', 401);
      }

      const { email, given_name, family_name, sub: googleId } = payload;

      if (!email) {
        throw new ApiError('Email not provided by Google', 400);
      }

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            firstName: given_name || '',
            lastName: family_name || '',
            password: '', // No password for Google users
            role: Role.CUSTOMER,
            isActive: true,
            googleId,
          },
        });
      } else {
        // Update Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
          });
        }
      }

      // Check if user is active
      if (!user.isActive) {
        throw new ApiError('User account is inactive', 401);
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Update user with refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Google authentication failed', 401);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<{ accessToken: string }> => {
    // Find user with refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken: data.refreshToken },
    });

    if (!user) {
      throw new ApiError('Invalid refresh token', 401);
    }

    // Generate new access token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  },

  /**
   * Logout a user
   */
  logout: async (userId: string): Promise<void> => {
    // Clear refresh token
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  /**
   * Change user password
   */
  changePassword: async (userId: string, data: ChangePasswordRequest): Promise<void> => {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};
