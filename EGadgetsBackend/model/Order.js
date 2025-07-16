const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential', // or the model you're using for users
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
    type: Number,
    required: true,
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
