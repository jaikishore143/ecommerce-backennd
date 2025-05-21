import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * Generate an access token for a user
 * @param payload - The data to include in the token
 * @returns The generated JWT token
 */
export const generateAccessToken = (payload: object): string => {
  // @ts-ignore - Ignoring type issues with expiresIn
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate a refresh token for a user
 * @param payload - The data to include in the token
 * @returns The generated refresh token
 */
export const generateRefreshToken = (payload: object): string => {
  // @ts-ignore - Ignoring type issues with expiresIn
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify a JWT token
 * @param token - The token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

/**
 * Verify a refresh token
 * @param token - The refresh token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    return null;
  }
};
