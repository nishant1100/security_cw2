import axios from 'axios';
import getBaseUrl from './baseURL';

// Secure API Client with CSRF and Auth token interceptors
class SecureApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: getBaseUrl(),
      withCredentials: true, // Include cookies in requests
      timeout: 10000,
    });

    // Request interceptor to add CSRF token and auth token
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token if available
        const csrfToken = localStorage.getItem('csrfToken');
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        // NOTE: Auth token should be added via context/hook in components
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only redirect to /login if not on /admin or /admin/*
          const path = window.location.pathname;
          if (!path.startsWith('/admin')) {
            window.location.href = '/login';
          }
          // If on /admin, do not redirect, let the page handle the error
        }
        return Promise.reject(error);
      }
    );
  }

  async fetchCsrfToken() {
    try {
      const response = await this.client.get('/api/csrf-token');
      localStorage.setItem('csrfToken', response.data.csrfToken);
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    }
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

// Input validation and sanitization
class InputValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        numbers: !hasNumbers,
        special: !hasSpecialChar
      }
    };
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    // Remove potential XSS vectors
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static sanitizeForSQL(input) {
    if (typeof input !== 'string') return input;
    // Remove SQL injection patterns
    return input
      .replace(/['";]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*.*?\*\//g, '') // Remove SQL block comments
      .trim();
  }
}

// Encryption utilities using CryptoJS
class EncryptionUtils {
  static encrypt(text, key = 'your-secret-key') {
    try {
      const CryptoJS = require('crypto-js');
      return CryptoJS.AES.encrypt(text, key).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  }

  static decrypt(encryptedText, key = 'your-secret-key') {
    try {
      const CryptoJS = require('crypto-js');
      const bytes = CryptoJS.AES.decrypt(encryptedText, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText;
    }
  }
}

// Client-side rate limiting
class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  isAllowed(key, maxAttempts, windowMs) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || { count: 0, resetTime: now + windowMs };
    // Reset if window has passed
    if (now > attempts.resetTime) {
      attempts.count = 0;
      attempts.resetTime = now + windowMs;
    }
    // Check if allowed
    if (attempts.count >= maxAttempts) {
      return false;
    }
    // Increment attempt count
    attempts.count++;
    this.attempts.set(key, attempts);
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

// Create instances
export const secureApi = new SecureApiClient();
export const rateLimiter = new RateLimiter();

// Export classes and utilities
export {
  EncryptionUtils, InputValidator
};
