const express = require("express");
const { addToCart, removeFromCart, getUserCart } = require("../controller/CartController");

const router = express.Router();

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.get("/:userId", getUserCart);

module.exports = router;
