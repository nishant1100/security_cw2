const app = require('./app');
const { logger } = require('./config/security');

const PORT = process.env.PORT || 3001; // Use port 3001 instead of 3000

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Security features enabled:`);
  console.log(`   • Helmet (Security Headers)`);
  console.log(`   • Rate Limiting`);
  console.log(`   • CSRF Protection`);
  console.log(`   • Session Management`);
  console.log(`   • Activity Logging`);
  console.log(`   • Input Sanitization`);
  console.log(`   • Account Lockout`);
  console.log(`   • Multi-Factor Authentication`);
  console.log(`   • Password Strength Validation`);
  console.log(`   • reCAPTCHA Integration`);
  console.log(`\n🔧 To stop the server, press Ctrl+C`);
  console.log(`\n🔑 Admin Login:`);
  console.log(`   URL: http://localhost:5173/admin`);
  console.log(`   Username: admin`);
  console.log(`   Password: admin123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = server; 