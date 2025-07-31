const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const winston = require('winston');
const crypto = require('crypto');
const PasswordValidator = require('password-validator');

// Winston Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'egadgets-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/activity.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Password Validator Schema
const passwordSchema = new PasswordValidator();
passwordSchema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .has().not().spaces();

// Rate Limiting Configuration
const createRateLimiters = () => {
  // General API rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Login rate limiter (more strict)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
      error: 'Too many login attempts, please try again later.',
      retryAfter: Math.ceil(15 * 60 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Registration rate limiter
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registration attempts per hour
    message: {
      error: 'Too many registration attempts, please try again later.',
      retryAfter: Math.ceil(60 * 60 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return { generalLimiter, loginLimiter, registerLimiter };
};

// Speed limiter for brute force prevention
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

// Modern CSRF Protection (without deprecated csurf)
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const validateCSRFToken = (req, res, next) => {
  // Get token from various possible locations
  const headerToken = req.headers['x-csrf-token'];
  const bodyToken = req.body && req.body._csrf;
  const formToken = req.body && typeof req.body.get === 'function' && req.body.get('_csrf');
  
  const token = headerToken || bodyToken || formToken;
  const sessionToken = req.session.csrfToken;

  // Debug logging
  console.log('CSRF validation:', {
    headerToken: headerToken ? 'present' : 'missing',
    bodyToken: bodyToken ? 'present' : 'missing',
    formToken: formToken ? 'present' : 'missing',
    sessionToken: sessionToken ? 'present' : 'missing',
    path: req.path
  });

  if (!token || !sessionToken || token !== sessionToken) {
    logger.warn('CSRF token validation failed', {
      ip: req.ip,
      path: req.path,
      tokenExists: !!token,
      sessionTokenExists: !!sessionToken,
      match: token === sessionToken
    });
    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Form submission failed. Please refresh the page and try again.'
    });
  }

  next();
};

// Encryption utilities
const encryptionKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const algorithm = 'aes-256-cbc';

const encryptData = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, encryptionKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
};

const decryptData = (encryptedData, iv) => {
  const decipher = crypto.createDecipher(algorithm, encryptionKey);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Account lockout tracking
const accountLockouts = new Map();

const checkAccountLockout = (userId) => {
  const lockoutInfo = accountLockouts.get(userId);
  if (lockoutInfo && lockoutInfo.lockedUntil > Date.now()) {
    return {
      locked: true,
      remainingTime: Math.ceil((lockoutInfo.lockedUntil - Date.now()) / 1000)
    };
  }
  return { locked: false };
};

const recordFailedLogin = (userId) => {
  const lockoutInfo = accountLockouts.get(userId) || { attempts: 0, lockedUntil: 0 };
  lockoutInfo.attempts += 1;
  
  if (lockoutInfo.attempts >= 5) {
    lockoutInfo.lockedUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
    logger.warn(`Account locked for user ${userId} due to multiple failed login attempts`);
  }
  
  accountLockouts.set(userId, lockoutInfo);
};

const resetFailedLogins = (userId) => {
  accountLockouts.delete(userId);
};

// Security middleware
const securityMiddleware = {
  // Helmet configuration
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["X-CSRF-Token"]
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }
};

// Activity logging
const logActivity = (userId, action, details = {}) => {
  logger.info({
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip || 'unknown'
  });
};

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

// XSS Protection
const xssProtection = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

module.exports = {
  logger,
  passwordSchema,
  createRateLimiters,
  speedLimiter,
  generateCSRFToken,
  validateCSRFToken,
  encryptData,
  decryptData,
  checkAccountLockout,
  recordFailedLogin,
  resetFailedLogins,
  securityMiddleware,
  logActivity,
  sanitizeInput,
  xssProtection
}; 