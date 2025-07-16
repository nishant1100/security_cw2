const express = require("express");
const { postAProduct, getAllProducts, getSingleProduct, updateProduct, deleteAProduct } = require("../controller/ProductController");
const multer = require("multer");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const ProductController = require('../controller/ProductController');


const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/User/Desktop/SonicSummit_Server/images"); // Change to your desired directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a product (with image & file upload)
router.post('/create-product', ProductController.createProduct);

// Get all products
router.get("/", getAllProducts);

// Get a single product by ID
router.get("/:id", getSingleProduct);

// Update a product by ID (with optional image & file upload)
router.put("/edit/:id", verifyAdminToken ,upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "productFile", maxCount: 1 }
]), updateProduct);

// Delete a product by ID
router.delete("/:id",verifyAdminToken, deleteAProduct);

module.exports = router;
