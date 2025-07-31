
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config(); // ✅ Load env vars early
const connectDB = require("./config/db");
const jwt = require('jsonwebtoken');

// Import security configuration
const {
  securityMiddleware,
  createRateLimiters,
  speedLimiter,
  generateCSRFToken,
  validateCSRFToken,
  logger,
  logActivity
} = require("./config/security");

// Import Routes
const UserRouter = require("./routes/UserRoute");
const ProductRouter = require("./routes/ProductRoute");
const CommunityPostRoute = require("./routes/CommunityPostRoute");
const AuthRouter = require("./routes/AuthRoute");
const OrderRouter = require("./routes/OrderRoute");
const AdminRouter = require("./routes/AdminRoute");
const AdminRoutes2 = require("./stats/adminStats");
const cartRoutes = require("./routes/CartRoutes");
const esewaRoute = require('./routes/EsewaRoute');

// Initialize Express app
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Security Middleware
app.use(securityMiddleware.helmet);
app.use(cors(securityMiddleware.cors));

// Session configuration
app.use(session({
  ...securityMiddleware.session,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/SonicSummit",
    collectionName: 'sessions'
  })
}));

// Rate limiting
const { generalLimiter, loginLimiter, registerLimiter } = createRateLimiters();
app.use(generalLimiter);
app.use(speedLimiter);

// CSRF Token middleware
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCSRFToken();
  }
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON requests with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan("combined", { stream: { write: message => logger.info(message.trim()) } }));
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve static images

// Activity logging middleware
app.use((req, res, next) => {
  let userId = 'anonymous';

  // Try to extract user info from JWT in Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32");
      userId = decoded.username || decoded.email || decoded.id || 'anonymous';
    } catch (err) {
      // Invalid token, ignore
    }
  }

  // Fallback to session userId if not found in JWT
  if (userId === 'anonymous' && req.session?.userId) {
    userId = req.session.userId;
  }

  logActivity(userId, `${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer')
  });
  next();
});

// CSRF Token endpoint for frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});

// ✅ Routes with rate limiting
app.use("/api/auth", loginLimiter, AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/communityposts", CommunityPostRoute);
app.use("/api/orders", OrderRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/admin2", AdminRoutes2);
app.use("/api/cart", cartRoutes);
app.use('/api/esewa', esewaRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    stack: err.stack,
    ip: req.ip,
    path: req.path
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('404 Not Found', { ip: req.ip, path: req.path });
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
console.log("Esewa route loaded:", esewaRoute.stack?.map(r => r.route?.path));

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;