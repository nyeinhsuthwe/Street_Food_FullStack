const express = require('express');
const OrderController = require("../controller/OrderController");
const router = express.Router();

router.post("/create-order", OrderController.createOrder);
router.get("/get-order-list", OrderController.getOrders);
router.patch('/update-status/:id', OrderController.updateOrderStatus);
router.get('/order-history', OrderController.orderHistory);

module.exports = router;