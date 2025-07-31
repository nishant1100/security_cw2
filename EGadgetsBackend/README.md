# EGadgets Backend - Secure E-commerce API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running on localhost:27017
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   or
   ```bash
   node start.js
   ```

3. **Development Mode (with auto-restart)**
   ```bash
   npm run dev
   ```

## 🔐 Security Features Implemented

### Authentication & Authorization
- ✅ **JWT-based Authentication** with 2-hour expiration
- ✅ **Multi-Factor Authentication (MFA)** via email
- ✅ **Role-Based Access Control (RBAC)** with granular permissions
- ✅ **Password Hashing** with bcrypt (12 salt rounds)
- ✅ **Account Lockout** after 5 failed attempts

### Protection Against Attacks
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **CSRF Protection** - Custom implementation (no deprecated packages)
- ✅ **XSS Prevention** - Input sanitization and CSP headers
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Helmet Security Headers** - Comprehensive security headers

### Data Security
- ✅ **Encryption** - AES-256-CBC for sensitive data
- ✅ **Secure Cookies** - HttpOnly, Secure, SameSite=Strict
- ✅ **Session Management** - MongoDB-based session storage
- ✅ **Input Validation** - Server and client-side validation

### Monitoring & Logging
- ✅ **Activity Logging** - Winston logger with file rotation
- ✅ **Security Event Tracking** - Failed logins, lockouts, violations
- ✅ **Real-time Monitoring** - Rate limit violations, suspicious activity

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (with email verification)
- `POST /api/auth/login` - User login (with MFA)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Email verification
- `GET /api/auth/user/:id` - Get user profile

### Products (Public)
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get single product

### Products (Admin Only)
- `POST /api/product/create-product` - Create new product
- `PUT /api/product/edit/:id` - Update product
- `DELETE /api/product/:id` - Delete product

### Security
- `GET /api/csrf-token` - Get CSRF token for forms

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/SonicSummit

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_SECRET=your-session-secret-key

# Email (for MFA)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# reCAPTCHA
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

## 🧪 Testing

### Run Security Tests
```bash
npm test
```

### Test Server Startup
```bash
node test-server.js
```

## 📁 Project Structure

```
EGadgetsBackend/
├── config/
│   ├── db.js              # Database connection
│   └── security.js        # Security configuration
├── controller/
│   ├── AuthController.js  # Authentication logic
│   ├── ProductController.js
│   └── OrderController.js
├── middleware/
│   ├── rbac.js           # Role-based access control
│   └── verifyAdminToken.js
├── model/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── AuthRoute.js
│   ├── ProductRoute.js
│   └── OrderRoute.js
├── security/
│   └── Auth.js           # JWT authentication
├── tests/
│   ├── security.test.js  # Security tests
│   └── product.test.js
├── logs/                 # Log files
├── images/               # Uploaded files
├── app.js               # Main application
├── start.js             # Server startup
└── package.json
```

## 🔍 Security Monitoring

### Log Files
- `logs/error.log` - Error logs
- `logs/activity.log` - Activity and security events

### Monitoring Points
- Failed login attempts
- Account lockouts
- Rate limit violations
- CSRF token failures
- Unauthorized access attempts

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

2. **Port Already in Use**
   ```bash
   # Change port in .env file
   PORT=3001
   ```

3. **CSRF Token Errors**
   - Ensure frontend is fetching CSRF tokens
   - Check that tokens are being sent with requests

4. **Rate Limiting**
   - Wait for rate limit window to expire
   - Check logs for rate limit violations

### Debug Mode
```bash
# Enable debug logging
DEBUG=* node start.js
```

## 📚 Security Documentation

For detailed security implementation documentation, see:
- `SECURITY_IMPLEMENTATION.md` - Comprehensive security guide
- `tests/security.test.js` - Security test cases

## 🎯 Features

### User Management
- Secure registration with email verification
- Multi-factor authentication
- Password strength requirements
- Account lockout protection

### Product Management
- Admin-only product CRUD operations
- File upload security
- Input validation and sanitization

### Order Processing
- Secure order creation
- Email confirmations
- Payment integration (eSewa)

### Security Features
- Comprehensive logging
- Real-time monitoring
- Automated threat detection
- Secure session management

## 🔒 Production Deployment

### Security Checklist
- [ ] Change all default secrets
- [ ] Configure HTTPS certificates
- [ ] Set up proper environment variables
- [ ] Configure database security
- [ ] Set up monitoring and alerting
- [ ] Run security tests
- [ ] Monitor logs for suspicious activity

### Performance
- Rate limiting prevents abuse
- Session management optimizes performance
- Logging with rotation prevents disk space issues
- Graceful shutdown handling

## 📞 Support

For security issues or questions:
1. Check the logs in `logs/` directory
2. Review the security documentation
3. Run the security tests
4. Check environment variable configuration

---

**⚠️ Security Notice**: This application implements comprehensive security features. Always use strong passwords, keep dependencies updated, and monitor logs for suspicious activity. 