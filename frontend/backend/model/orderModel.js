const mongoose = require('mongoose');

const schema = mongoose.Schema;

const OrderSchema = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            menu_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                
            },
            subtotal: {
                type: Number,
                
            },
        }
    ],
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "kbzpay", "wavepay"],
      default: "mobile",
    },
    status: { 
        type: String, 
        enum: ["pending", "delivered", "canceled", "successed"], 
        default: "pending" 
    },
    deliveryType: { 
        type: String, 
        enum: ["delivery", "takeaway","dinein"], 
        default: "takeaway" 
    },
    address: {
      type: String,
      required: function () {
        return this.deliveryType === "delivery";
      },
    },

    phone: {
      type: String,
      required: true,
    },    
},
  { timestamps: true }
)

module.exports = mongoose.model("Order" , OrderSchema)