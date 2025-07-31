const express = require("express");
const { postAProduct, getAllProducts, getSingleProduct, updateProduct, deleteAProduct } = require("../controller/ProductController");
const multer = require("multer");
const { authenticateToken } = require("../security/Auth");
const { requireAdmin, authorize, PERMISSIONS } = require("../middleware/rbac");
const { validateCSRFToken } = require("../config/security");
const ProductController = require('../controller/ProductController');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images"); // Change to your desired directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Define a custom middleware for handling CSRF validation with multer
const validateMulterCSRF = (req, res, next) => {
  // Extract the CSRF token from headers
  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;
  
  console.log('CSRF Validation (custom):', {
    token,
    sessionToken,
    headers: Object.keys(req.headers),
    path: req.path,
    authHeader: req.headers['authorization'] ? 'Present' : 'Missing'
  });
  
  // Validate the token
  if (!token || !sessionToken || token !== sessionToken) {
    console.log('CSRF validation failed (custom middleware)');
    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Form submission failed. Please refresh the page and try again.'
    });
  }
  
  next();
};

// Create a product (with image & file upload) - Admin only
router.post('/create-product',
  validateMulterCSRF,
  authenticateToken,
  requireAdmin,
  upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "productFile", maxCount: 1 }
  ]),
  ProductController.createProduct
);

// Get all products - Public access
router.get("/", getAllProducts);

// Get a single product by ID - Public access
router.get("/:id", getSingleProduct);

// Update a product by ID (with optional image & file upload) - Admin only
router.put("/edit/:id",
  validateMulterCSRF,
  authenticateToken,
  requireAdmin,
  upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "productFile", maxCount: 1 }
  ]),
  updateProduct
);

// Delete a product by ID - Admin only
router.delete("/:id", 
  authenticateToken, 
  requireAdmin, 
  deleteAProduct
);

module.exports = router;
