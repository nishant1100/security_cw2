const express = require("express");
const { findAll, save, findById, deleteById, updateById } = require("../controller/UserController");
const UserValidation = require("../validations/UserValidation");
const router = express.Router();

// Get all users
router.get("/", findAll);

// Save a new user (Validate user data before saving)
router.post("/", UserValidation, save);

// Get a user by ID
router.get("/:id", findById);

// Delete a user by ID
router.delete("/:id", deleteById);

// Update a user by ID (Validate user data before updating)
router.put("/:id", UserValidation, updateById);

module.exports = router;
