const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
  login, 
  register, 
  logout
} = require("../controller/AuthController");
const { authenticateToken } = require("../security/Auth");
const { validateCSRFToken } = require("../config/security");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer instance
const upload = multer({ storage });

// Register user (Direct Save - No Email Verification) - with CSRF protection
router.post("/register", validateCSRFToken, upload.single("profilePicture"), register);

// Login user - with CSRF protection
router.post("/login", validateCSRFToken, login);

// Logout user (requires authentication)
router.post("/logout", authenticateToken, logout);

module.exports = router;
