const express = require('express');
const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateCSRFToken } = require('../config/security');
const { logActivity } = require('../config/security');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32";

// Generate MFA code
const generateMFACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store MFA codes temporarily (in production, use Redis)
const adminMFACodes = new Map();

// Send MFA Email for Admin
const sendAdminMFAEmail = async (email, code) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "nishantkjnkrstha10@gmail.com",
      pass: process.env.EMAIL_PASS || "bkvs rcat vkvm zqxw",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: '"e~Gadgets Admin" <nishantkjnkrstha10@gmail.com>',
    to: email,
    subject: "Admin Login Verification Code",
    html: `
      <p>Your admin verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this code, please contact system administrator immediately.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Get Activity Logs
router.get("/logs", async (req, res) => {
  try {
    const logsPath = path.join(__dirname, '../logs/activity.log');
    
    if (!fs.existsSync(logsPath)) {
      return res.status(404).json({ message: "Log file not found" });
    }

    const logContent = fs.readFileSync(logsPath, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim());
    
    const logs = logLines.map(line => {
      try {
        const logEntry = JSON.parse(line);
        return {
          timestamp: logEntry.timestamp,
          userId: logEntry.userId || 'anonymous',
          action: logEntry.action,
          details: logEntry.details || {},
          ip: logEntry.details?.ip || 'unknown',
          userAgent: logEntry.details?.userAgent || 'unknown',
          method: logEntry.action?.split(' ')[0] || 'GET',
          url: logEntry.action?.split(' ')[1] || '/',
          level: logEntry.level || 'info'
        };
      } catch (error) {
        return null;
      }
    }).filter(log => log !== null);

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    res.json({
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(logs.length / limit),
        totalLogs: logs.length,
        hasNextPage: endIndex < logs.length,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

// Get Error Logs
router.get("/error-logs", async (req, res) => {
  try {
    const logsPath = path.join(__dirname, '../logs/error.log');
    
    if (!fs.existsSync(logsPath)) {
      return res.status(404).json({ message: "Error log file not found" });
    }

    const logContent = fs.readFileSync(logsPath, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim());
    
    const logs = logLines.map(line => {
      try {
        const logEntry = JSON.parse(line);
        return {
          timestamp: logEntry.timestamp,
          level: logEntry.level,
          message: logEntry.message,
          stack: logEntry.stack,
          service: logEntry.service
        };
      } catch (error) {
        return null;
      }
    }).filter(log => log !== null);

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    res.json({
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(logs.length / limit),
        totalLogs: logs.length,
        hasNextPage: endIndex < logs.length,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching error logs:', error);
    res.status(500).json({ message: "Failed to fetch error logs" });
  }
});

// Clear Logs
router.delete("/logs", async (req, res) => {
  try {
    const activityLogPath = path.join(__dirname, '../logs/activity.log');
    const errorLogPath = path.join(__dirname, '../logs/error.log');
    
    if (fs.existsSync(activityLogPath)) {
      fs.writeFileSync(activityLogPath, '');
    }
    
    if (fs.existsSync(errorLogPath)) {
      fs.writeFileSync(errorLogPath, '');
    }

    res.json({ message: "Logs cleared successfully" });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ message: "Failed to clear logs" });
  }
});

// ✅ Admin Register Route
router.post("/register", validateCSRFToken, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this username or email already exists" });
    }

    const newAdmin = new Admin({
      username,
      email,
      password,
      role: "admin"
    });

    await newAdmin.save();

    logActivity(newAdmin.username || newAdmin.email, 'ADMIN_REGISTERED', {
      email,
      username,
      ip: req.ip
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Admin registration failed:", err);
    logActivity('anonymous', 'ADMIN_REGISTRATION_ERROR', {
      error: err.message,
      ip: req.ip
    });
    res.status(500).json({ message: "Internal server error" });
  }
});

// Simple Admin Login (for debugging)
router.post("/admin-simple", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        console.log('🔍 Admin login attempt:', { username, password: '***' });
        
        // Find admin
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            console.log('❌ Admin not found:', username);
            return res.status(404).json({ message: "Admin not found!" });
        }
        
        console.log('✅ Admin found:', admin.username, admin.email);
        
        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('🔐 Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role }, 
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log('✅ Admin login successful');

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
        
    } catch (error) {
        console.error("Failed to login as admin", error);
        res.status(401).json({ message: "Failed to login as admin" });
    }
});

// Admin Login with MFA
router.post("/admin", validateCSRFToken, async (req, res) => {
    const { username, password, mfaCode, recaptchaToken } = req.body;
    try {
        // Validate reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ message: "reCAPTCHA verification required" });
        }

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            logActivity(username, 'ADMIN_LOGIN_FAILED', {
                reason: 'Admin not found',
                ip: req.ip
            });
            return res.status(404).json({ message: "Admin not found!" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            logActivity(admin._id, 'ADMIN_LOGIN_FAILED', {
                reason: 'Invalid password',
                ip: req.ip
            });
            return res.status(401).json({ message: "Invalid password!" });
        }

// MFA step 1: If no mfaCode, generate and send, store in backend
        if (!mfaCode) {
            const generatedCode = generateMFACode();
            adminMFACodes.set(admin._id.toString(), {
                code: generatedCode,
                expires: Date.now() + (10 * 60 * 1000) // 10 minutes
            });
            await sendAdminMFAEmail(admin.email, generatedCode);
            logActivity(admin._id, 'ADMIN_MFA_CODE_SENT', {
                email: admin.email,
                ip: req.ip
            });
            return res.status(200).json({ 
                message: "MFA code sent to your email",
                requiresMFA: true
            });
        } else {
            // MFA step 2: verify code
            const storedCode = adminMFACodes.get(admin._id.toString());
            console.log('DEBUG MFA:', {
                stored: storedCode,
                received: mfaCode,
                adminId: admin._id.toString()
            });
            if (!storedCode || storedCode.code !== mfaCode || Date.now() > storedCode.expires) {
                logActivity(admin._id, 'ADMIN_MFA_FAILED', {
                    ip: req.ip,
                    storedCode,
                    receivedCode: mfaCode
                });
                return res.status(403).json({ message: "Invalid or expired MFA code" });
            }
            logActivity(admin._id, 'ADMIN_MFA_SUCCESS', {
                ip: req.ip,
                storedCode,
                receivedCode: mfaCode
            });
            adminMFACodes.delete(admin._id.toString());
            // MFA success: forward to dashboard (frontend should handle navigation)
            // Generate token
            const token = jwt.sign(
                { id: admin._id, username: admin.username, role: admin.role }, 
                JWT_SECRET,
                { expiresIn: "24h" }
            );
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/'
            });
            res.cookie('sessionId', admin._id.toString(), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/'
            });
            logActivity(admin._id, 'ADMIN_LOGIN_SUCCESS', {
                username: admin.username,
                email: admin.email,
                ip: req.ip
            });
            return res.status(200).json({
                message: "Authentication successful",
                token: token,
                user: {
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role }, 
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Set secure HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        // Set session cookie for CSRF protection
        res.cookie('sessionId', admin._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        logActivity(admin._id, 'ADMIN_LOGIN_SUCCESS', {
            username: admin.username,
            email: admin.email,
            ip: req.ip
        });

        return res.status(200).json({
            message: "Authentication successful",
            user: {
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Failed to login as admin", error);
        logActivity('anonymous', 'ADMIN_LOGIN_ERROR', {
            error: error.message,
            ip: req.ip
        });
        res.status(401).json({ message: "Failed to login as admin" });
    }
});

module.exports = router;