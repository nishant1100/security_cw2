const Cart = require("../model/Cart");
const Product = require("../model/Product");
const Credential = require("../model/Credentials"); // Import user model

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // ✅ Check if user exists
    const userExists = await Credential.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // ✅ Create new cart if not found
      cart = new Cart({
        userId,
        items: [{ productId }],
        totalPrice: product.new_price, // Assume new_price exists
      });
    } else {
      // ✅ Check if product is already in cart
      const itemExists = cart.items.some((item) =>
        item.productId.equals(productId)
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in cart" });
      }

      // ✅ Add new item and update total price
      cart.items.push({ productId });
      cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(product.new_price);
    }

    // ✅ Save cart
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // ✅ Check if user exists
      const userExists = await Credential.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // ✅ Check if product is in cart
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
  
      // ✅ Get product price and update total price
      const product = await Product.findById(productId);
      cart.totalPrice = parseFloat(cart.totalPrice) - parseFloat(product.new_price);
  
      // ✅ Remove item from cart
      cart.items.splice(itemIndex, 1);
  
      // ✅ If cart is empty, delete it
      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return res.status(200).json({ message: "Cart deleted" });
      }
  
      await cart.save();
      res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const getUserCart = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // ✅ Check if user exists
      const userExists = await Credential.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const cart = await Cart.findOne({ userId }).populate("items.productId");
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  module.exports = { addToCart, removeFromCart, getUserCart };
