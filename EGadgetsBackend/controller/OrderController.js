const Order = require("../model/Order");
const Product = require("../model/Product");
const Cart = require("../model/Cart");
const nodemailer = require('nodemailer');
const Credential = require("../model/Credentials");
const mongoose = require('mongoose');

// Create an Order
const createAOrder = async (req, res) => {
  console.log("Incoming body:", req.body);

  try {
    // const { userId, name, email, phone } = req.body;
    const {
      userId,
      name,
      email,
      phone,
      address,
      productIds,
      totalPrice
    } = req.body;



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



    // Prepare the order data
    const orderData = {
      userId,
      name,
      email,
      phone,
      address,
      productIds,
      totalPrice: parseFloat(totalPrice),
    };

    // console.log("Recieved order:", orderData)
    console.log("Final orderData to save:", orderData);


    // Create a new order
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    // Send simple confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nishantkjnkrstha10@gmail.com',
        pass: 'bkvs rcat vkvm zqxw',
      },
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"e~Gadgets" <nishantkjnkrstha10@gmail.com>',
      to: userExists.email,
      subject: 'Your Order Confirmation',
      text: `Hello ${name},\n\nThank you for your order.`,
    };

    await transporter.sendMail(mailOptions);


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

// Get Orders by User ID
const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const orders = await Order.find({ userId }).populate({
      path: "productIds",
      select: "productName new_price productImage description",
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this userId" });
    }
    
    console.log('Populated Orders:', orders);  // Check output here

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
