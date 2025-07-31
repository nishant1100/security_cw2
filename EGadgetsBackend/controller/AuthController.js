const Credential = require('../model/Credentials');
// const nodemailer = require('nodemailer');
const Admin = require('../model/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { logActivity, sanitizeInput } = require('../config/security');

const JWT_SECRET = process.env.JWT_SECRET || "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32";

// Generate MFA code
const generateMFACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store MFA codes temporarily (in production, use Redis)
const mfaCodes = new Map();

// Send verification email
const sendVerificationEmail = async (email, verificationCode) => {
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
    from: '"e~Gadgets" <nishantkjnkrstha10@gmail.com>',
    to: email,
    subject: "Email Verification",
    html: `
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        `,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Register Route
const register = async (req, res) => {
  const { username, email, password, bio, recaptchaToken } = req.body;
  try {
    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedBio = sanitizeInput(bio);

    // Check if user already exists
    const existingUser = await Credential.findOne({
      $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }]
    });
    if (existingUser) {
      logActivity('anonymous', 'REGISTRATION_FAILED', {
        reason: 'User already exists',
        email: sanitizedEmail,
        ip: req.ip
      });
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user directly (no email verification)
    const newUser = new Credential({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password,
      bio: sanitizedBio
    });
    await newUser.save();

    logActivity(newUser.username || newUser.email, 'USER_REGISTERED', {
      email: sanitizedEmail,
      username: sanitizedUsername,
      ip: req.ip
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration failed:", error);
    logActivity('anonymous', 'REGISTRATION_ERROR', {
      error: error.message,
      ip: req.ip
    });
    res.status(500).json({ message: "Registration failed" });
  }
};

// Store MFA codes for users
const userMFACodes = new Map();

// Send MFA Email for User
const sendUserMFAEmail = async (email, code) => {
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
    from: '"e~Gadgets" <nishantkjnkrstha10@gmail.com>',
    to: email,
    subject: "User Login Verification Code",
    html: `
      <p>Your user verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this code, please contact system administrator immediately.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// ✅ Login Route with MFA
const login = async (req, res) => {
  const { username, password, mfaCode, recaptchaToken } = req.body;
  try {
    // Sanitize username
    const sanitizedUsername = sanitizeInput(username);
    // Find user by username or email in Credential model
    const user = await Credential.findOne({
      $or: [{ username: sanitizedUsername }, { email: sanitizedUsername }]
    });
    if (!user) {
      logActivity(sanitizedUsername, 'LOGIN_FAILED', {
        reason: 'User not found',
        ip: req.ip
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logActivity(user._id, 'LOGIN_FAILED', {
        reason: 'Invalid password',
        ip: req.ip
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // MFA step 1: If no mfaCode, generate and send, store in backend
    if (!mfaCode) {
      const generatedCode = generateMFACode();
      userMFACodes.set(user._id.toString(), {
        code: generatedCode,
        expires: Date.now() + (10 * 60 * 1000) // 10 minutes
      });
      await sendUserMFAEmail(user.email, generatedCode);
      logActivity(user._id, 'USER_MFA_CODE_SENT', {
        email: user.email,
        ip: req.ip
      });
      return res.status(200).json({ 
        message: "MFA code sent to your email",
        requiresMFA: true
      });
    } else {
      // MFA step 2: verify code
      const storedCode = userMFACodes.get(user._id.toString());
      console.log('DEBUG USER MFA:', {
        stored: storedCode,
        received: mfaCode,
        userId: user._id.toString()
      });
      if (!storedCode || storedCode.code !== mfaCode || Date.now() > storedCode.expires) {
        logActivity(user._id, 'USER_MFA_FAILED', {
          ip: req.ip,
          storedCode,
          receivedCode: mfaCode
        });
        return res.status(403).json({ message: "Invalid or expired MFA code" });
      }
      logActivity(user._id, 'USER_MFA_SUCCESS', {
        ip: req.ip,
        storedCode,
        receivedCode: mfaCode
      });
      userMFACodes.delete(user._id.toString());
      // MFA success: forward to dashboard (frontend should handle navigation)
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      logActivity(user.username || user.email, 'LOGIN_SUCCESS', {
        username: user.username,
        email: user.email,
        ip: req.ip
      });
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error("Login failed:", error);
    logActivity('anonymous', 'LOGIN_ERROR', {
      error: error.message,
      ip: req.ip
    });
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Logout Route
const logout = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('authToken', { path: '/' });
    res.clearCookie('sessionId', { path: '/' });
    
    logActivity(req.user?.id || 'anonymous', 'LOGOUT', {
      ip: req.ip
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

// ✅ Verify User Route
const verifyUser = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    logActivity(user._id, 'EMAIL_VERIFIED', {
      email: user.email,
      ip: req.ip
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification failed:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyUser
};


