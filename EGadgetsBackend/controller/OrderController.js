const Order = require("../model/Order");
const Product = require("../model/Product");
const Cart = require("../model/Cart");
const nodemailer = require('nodemailer');
const Credential = require("../model/Credentials");
const mongoose = require('mongoose');

// Create an Order
const createAOrder = async (req, res) => {
  try {
    const { userId, name, email, phone } = req.body;

    // Validate if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Check if user exists (email is sufficient for user validation in this case)
    const userExists = await Credential.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the name is provided in the request body
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if user has a cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare the order data
    const orderData = {
      userId,
      name,  // Use the name from the request body
      email: userExists.email,
      phone,
      productIds: cart.items.map(item => item.productId),
      totalPrice: cart.totalPrice
    };

    // Create a new order
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    // Prepare product files (if available)
    const productFiles = cart.items
      .map(item => item.productId.productFile)
      .filter(file => file);

    // Send confirmation email with attachments
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: '', 
      },
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: 'pkripesh345@gmail.com',
      to: userExists.email,
      subject: 'Your Order Confirmation',
      text: `Hello ${name},\n\nThank you for your order. Please find the product files attached.`,
      attachments: productFiles.map(file => ({
        filename: file.split('/').pop(),
        path: file,
      })),
    };

    await transporter.sendMail(mailOptions);

    // Clear the cart after order creation
    await Cart.findByIdAndDelete(cart._id);

    // Send response with the created order and the userId
    res.status(200).json({
      order: savedOrder,
      userId: userExists._id, // Include the userId in the response
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};


// Get all Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('productIds');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get Orders by User Email
// Get Orders by User ID
const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const orders = await Order.find({ userId }).populate('productIds');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this userId" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders by userId", error);
    res.status(500).json({ message: "Failed to fetch orders by userId" });
  }
};


module.exports = {
  createAOrder,
  getOrderByUserId,
  getAllOrders,
};
