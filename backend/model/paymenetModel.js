const mongoose = require('mongoose')

const schema = mongoose.Schema;

const PaymentSchema = new schema({
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Payment", PaymentSchema)