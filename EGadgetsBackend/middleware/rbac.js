const { logActivity } = require('../config/security');

// Role hierarchy
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Permission definitions
const PERMISSIONS = {
  // User permissions
  READ_OWN_PROFILE: 'read_own_profile',
  UPDATE_OWN_PROFILE: 'update_own_profile',
  CREATE_ORDER: 'create_order',
  VIEW_OWN_ORDERS: 'view_own_orders',
  
  // Admin permissions
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_USERS: 'manage_users',
  VIEW_ALL_ORDERS: 'view_all_orders',
  MANAGE_ADMIN: 'manage_admin',
  VIEW_ANALYTICS: 'view_analytics',
  
  // Moderator permissions
  MODERATE_COMMENTS: 'moderate_comments',
  VIEW_REPORTS: 'view_reports'
};

// Define user permissions first
const USER_PERMISSIONS = [
  PERMISSIONS.READ_OWN_PROFILE,
  PERMISSIONS.UPDATE_OWN_PROFILE,
  PERMISSIONS.CREATE_ORDER,
  PERMISSIONS.VIEW_OWN_ORDERS
];

// Define moderator permissions (includes user permissions)
const MODERATOR_PERMISSIONS = [
  ...USER_PERMISSIONS,
  PERMISSIONS.MODERATE_COMMENTS,
  PERMISSIONS.VIEW_REPORTS
];

// Define admin permissions (includes moderator permissions)
const ADMIN_PERMISSIONS = [
  ...MODERATOR_PERMISSIONS,
  PERMISSIONS.MANAGE_PRODUCTS,
  PERMISSIONS.MANAGE_USERS,
  PERMISSIONS.VIEW_ALL_ORDERS,
  PERMISSIONS.MANAGE_ADMIN,
  PERMISSIONS.VIEW_ANALYTICS
];

// Role-permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.USER]: USER_PERMISSIONS,
  [ROLES.MODERATOR]: MODERATOR_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS
};

// Check if user has specific permission
const hasPermission = (userRole, requiredPermission) => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(requiredPermission);
};

// Check if user has any of the required permissions
const hasAnyPermission = (userRole, requiredPermissions) => {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

// Check if user has all required permissions
const hasAllPermissions = (userRole, requiredPermissions) => {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

// RBAC middleware for specific permissions
const authorize = (requiredPermissions, requireAll = false) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        logActivity('anonymous', 'UNAUTHORIZED_ACCESS', {
          path: req.path,
          method: req.method,
          ip: req.ip
        });
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
      }

      const userRole = user.role || ROLES.USER;
      const hasAccess = requireAll 
        ? hasAllPermissions(userRole, requiredPermissions)
        : hasAnyPermission(userRole, requiredPermissions);

      if (!hasAccess) {
        logActivity(user.userId || user._id, 'FORBIDDEN_ACCESS', {
          path: req.path,
          method: req.method,
          userRole,
          requiredPermissions,
          ip: req.ip
        });
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: 'You do not have permission to access this resource'
        });
      }

      // Log successful access
      logActivity(user.userId || user._id, 'AUTHORIZED_ACCESS', {
        path: req.path,
        method: req.method,
        userRole,
        permissions: requiredPermissions,
        ip: req.ip
      });

      next();
    } catch (error) {
      logActivity('unknown', 'RBAC_ERROR', {
        error: error.message,
        path: req.path,
        ip: req.ip
      });
      res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization'
      });
    }
  };
};

// Role-based middleware
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        logActivity('anonymous', 'UNAUTHORIZED_ACCESS', {
          path: req.path,
          method: req.method,
          ip: req.ip
        });
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
      }

      const userRole = user.role || ROLES.USER;
      const hasRequiredRole = Array.isArray(requiredRoles) 
        ? requiredRoles.includes(userRole)
        : requiredRoles === userRole;

      if (!hasRequiredRole) {
        logActivity(user.userId || user._id, 'FORBIDDEN_ACCESS', {
          path: req.path,
          method: req.method,
          userRole,
          requiredRoles,
          ip: req.ip
        });
        return res.status(403).json({ 
          error: 'Insufficient role',
          message: 'You do not have the required role to access this resource'
        });
      }

      // Log successful access
      logActivity(user.userId || user._id, 'AUTHORIZED_ACCESS', {
        path: req.path,
        method: req.method,
        userRole,
        requiredRoles,
        ip: req.ip
      });

      next();
    } catch (error) {
      logActivity('unknown', 'RBAC_ERROR', {
        error: error.message,
        path: req.path,
        ip: req.ip
      });
      res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization'
      });
    }
  };
};

// Admin-only middleware
const requireAdmin = requireRole(ROLES.ADMIN);

// User resource ownership check
const requireOwnership = (resourceType) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id || req.params.userId;
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
      }

      // Admin can access any resource
      if (user.role === ROLES.ADMIN) {
        return next();
      }

      // Users can only access their own resources
      if (user.userId === resourceId || user._id === resourceId) {
        return next();
      }

      logActivity(user.userId || user._id, 'FORBIDDEN_ACCESS', {
        path: req.path,
        method: req.method,
        resourceType,
        resourceId,
        ip: req.ip
      });

      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only access your own resources'
      });
    } catch (error) {
      logActivity('unknown', 'OWNERSHIP_CHECK_ERROR', {
        error: error.message,
        path: req.path,
        ip: req.ip
      });
      res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization'
      });
    }
  };
};

module.exports = {
  ROLES,
  PERMISSIONS,
  authorize,
  requireRole,
  requireAdmin,
  requireOwnership,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
}; 