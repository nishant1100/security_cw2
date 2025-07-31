const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Sample activity logs
const activityLogs = [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    userId: 'admin',
    action: 'GET /api/admin/logs',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    userId: 'aryan',
    action: 'POST /api/auth/login',
    details: { ip: '192.168.1.101', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: 'anonymous',
    action: 'GET /api/product/',
    details: { ip: '192.168.1.102', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    userId: 'admin',
    action: 'POST /api/admin/admin',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    userId: 'john_doe',
    action: 'POST /api/auth/register',
    details: { ip: '192.168.1.103', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: 'anonymous',
    action: 'GET /api/orders/',
    details: { ip: '192.168.1.104', userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0' },
    level: 'warn'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    userId: 'admin',
    action: 'DELETE /api/product/123',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    userId: 'anonymous',
    action: 'POST /api/auth/login',
    details: { ip: '192.168.1.105', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    level: 'error'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    userId: 'admin',
    action: 'PUT /api/product/456',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    level: 'info'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    userId: 'jane_smith',
    action: 'GET /api/cart/',
    details: { ip: '192.168.1.106', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    level: 'info'
  }
];

// Sample error logs
const errorLogs = [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    level: 'error',
    message: 'Database connection failed',
    stack: 'Error: connect ECONNREFUSED 127.0.0.1:27017\n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)',
    service: 'egadgets-backend'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    level: 'warn',
    message: 'Rate limit exceeded for IP 192.168.1.105',
    stack: null,
    service: 'egadgets-backend'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    level: 'error',
    message: 'Invalid JWT token provided',
    stack: 'JsonWebTokenError: invalid token\n    at Object.verify (/app/node_modules/jsonwebtoken/verify.js:63:17)',
    service: 'egadgets-backend'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    level: 'warn',
    message: 'CSRF token validation failed',
    stack: null,
    service: 'egadgets-backend'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    level: 'error',
    message: 'Product not found with ID: 999',
    stack: 'Error: Product not found\n    at ProductController.getProduct (/app/controller/ProductController.js:45:12)',
    service: 'egadgets-backend'
  }
];

// Write activity logs
const activityLogPath = path.join(logsDir, 'activity.log');
const activityLogContent = activityLogs.map(log => JSON.stringify(log)).join('\n');
fs.writeFileSync(activityLogPath, activityLogContent);

// Write error logs
const errorLogPath = path.join(logsDir, 'error.log');
const errorLogContent = errorLogs.map(log => JSON.stringify(log)).join('\n');
fs.writeFileSync(errorLogPath, errorLogContent);

console.log('✅ Test logs generated successfully!');
console.log(`📁 Activity logs: ${activityLogPath}`);
console.log(`📁 Error logs: ${errorLogPath}`);
console.log(`📊 Total activity logs: ${activityLogs.length}`);
console.log(`📊 Total error logs: ${errorLogs.length}`); 