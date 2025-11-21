const express = require('express');
const PaymentController = require("../controller/PaymentController");

const router = express.Router();

router.post("/create-pay", PaymentController.createPayment);
router.get("/get-pay-status/:id", PaymentController.getPaymentStatus);
router.post("/confirm-pay", PaymentController.confirmPayment)

module.exports = router;