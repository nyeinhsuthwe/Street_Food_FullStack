const Payment = require('../model/paymenetModel');

const PaymentController = {
    
    createPayment: async (req, res) => {
        try {
            const { amount, user_id } = req.body;

            if (!amount || !user_id) {
                return res.status(400).json({ success: false, message: "Amount and user_id required" });
            }

            const payment = await Payment.create({
                amount,
                status: "pending",
                user_id: user_id
            });

            res.status(201).json({
                success: true,
                paymentId: payment._id
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPaymentStatus: async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        res.json({
            success: true,
            status: payment.status
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
    },
    
    confirmPayment: async (req, res) => {
    try {
        const { id } = req.body;

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        payment.status = "success";
        await payment.save();

        res.json({ success: true, message: "Payment confirmed" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


}

module.exports = PaymentController;
