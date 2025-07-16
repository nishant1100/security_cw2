const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,   // ← changed from Number to String
    required: true,
  },
  address: {         // ← new address field
    city: { type: String },
    country: { type: String },
    state: { type: String },
    zipcode: { type: String },
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
