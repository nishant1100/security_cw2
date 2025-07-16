const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    artistName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
    },
    old_price: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Price must be a positive number.",
      },
    },

    new_price: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Price must be a positive number.",
      },
    },
    productImage: {
      type: String,
      default: null,
    },
    productFile: {
      type: String,
      default: null,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

const Product = mongoose.model("Product", productSchema); 
module.exports = Product;
