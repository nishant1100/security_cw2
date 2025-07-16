const multer = require('multer');
const path = require('path');
const Product = require("../model/Product");

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Specify the folder where files will be stored
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the current timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create multer instance for handling multiple files
const upload = multer({ storage: storage });

// Middleware for handling file uploads
const uploadFields = upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'productFile', maxCount: 1 },
]);

// Create a new product
const createProduct = async (req, res) => {
  // Use the uploadFields middleware to handle file uploads
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(500).send({ message: "File upload failed", error: err });
    }

    try {
      // Destructure fields from the request body
      const { title, artistName, description, old_price, new_price, category, trending } = req.body;

      // Handle product image and file if available
      const productImage = req.files["productImage"]
        ? `/images/${req.files["productImage"][0].filename}`
        : null;

      const productFile = req.files["productFile"]
        ? req.files["productFile"][0].path
        : null;

      // Create a new product document
      const newProduct = new Product({
        title,
        artistName,
        description,
        old_price,
        new_price,
        category,
        trending,
        productImage,
        productFile,
      });

      // Save the new product to the database
      await newProduct.save();

      // Return success response
      res.status(200).send({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send({ message: "Failed to create product", error: error.message });
    }
  });
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }
    res.status(200).send(product);
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFields = { ...req.body };

    // Handle product image and file if available
    if (req.files["productImage"]) {
      updatedFields.productImage = `/images/${req.files["productImage"][0].filename}`;
    }
    
    if (req.files["productFile"]) {
      updatedFields.productFile = req.files["productFile"][0].path;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found!" });
    }
    res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).send({ message: "Failed to update product" });
  }
};

// Delete a product by ID
const deleteAProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found!" });
    }
    res.status(200).send({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteAProduct,
};
