/**
 * Authentication Utility
 * Handles mock authentication logic
 */

import { mockUsers } from './mockData';

/**
 * Validate user login (mock)
 * In real app, this would call a backend API
 *
 * For demo, accepts:
 * - Email: demo@example.com
 * - Password: anything
 */
export const validateLogin = (email: string, password: string): boolean => {
  if (!email || !password) {
    return false;
  }

  // Check if user exists in mock database
  const userExists = email in mockUsers;

  if (userExists && password.length >= 6) {
    return true;
  }

  return false;
};

/**
 * Validate signup
 * In real app, would validate against backend
 */
export const validateSignup = (
  email: string,
  password: string,
  confirmPassword: string,
  backupEmail: string
): { valid: boolean; error?: string } => {
  if (!email || !password || !confirmPassword || !backupEmail) {
    return { valid: false, error: 'All fields are required' };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Password length
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  // Password match
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  // Backup email validation
  if (!emailRegex.test(backupEmail)) {
    return { valid: false, error: 'Invalid backup email format' };
  }

  return { valid: true };
};

/**
 * Validate OTP recovery
 * For demo, backup email must match and OTP is "123456"
 */
export const validateRecovery = (email: string, backupEmail: string, otp: string): boolean => {
  const user = mockUsers[email];

  if (!user) {
    return false;
  }

  // Check if provided backup email matches registered backup email
  if (user.backupEmail !== backupEmail) {
    return false;
  }

  // Check OTP (demo OTP is "123456")
  if (otp !== '123456') {
    return false;
  }

  return true;
};
