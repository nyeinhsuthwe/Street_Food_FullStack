const express = require('express');
const OrderController = require("../controller/OrderController");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/create-order", upload.single("payment_bill"), OrderController.createOrder);
router.get("/get-order-list", OrderController.getOrders);
router.patch('/update-status/:id', OrderController.updateOrderStatus);
router.get('/order-history', OrderController.orderHistory);
router.delete('/delete-order/:id', OrderController.deleteOrder)

module.exports = router;
