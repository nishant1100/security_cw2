const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "creds", // Reference to the Credentials collection
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true,
        }
      }
    ],
    totalPrice: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
