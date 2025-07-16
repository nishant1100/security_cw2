const express = require('express');
const { createAOrder, getOrderByUserId, getAllOrders } = require('../controller/OrderController');

const router =  express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email 
router.get("/user/:userId", getOrderByUserId); // Updated this route

router.get("/", getAllOrders); 


module.exports = router;