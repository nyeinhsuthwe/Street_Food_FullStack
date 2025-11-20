const Order = require('../model/orderModel');
const Menu = require('../model/menuModel')
const User = require('../model/userModel')

const OrderController = {

    createOrder: async (req, res) => {
        try {
            console.log("Request body:", req.body);
            const { user_id, items, paymentMethod, deliveryType, address, fullname, phone } = req.body;
            const orderItems = []
            const user = await User.findById(user_id)
            if (!user) {
                return res.json({ msg: "use not found" })
            }

            for (const item of items) {
                const menu = await Menu.findById(item.menu_id);
                if (!menu) {
                    return res.status(404).json({ message: "Menu not found" });
                }
                const price = menu.price
                const quantity = item.quantity
                const subtotal = price * quantity

                orderItems.push({
                    menu_id: item.menu_id,
                    quantity,
                    price,
                    subtotal
                })

            }

            const createOrder = await Order.create({
                user_id,
                items: orderItems,
                paymentMethod,
                deliveryType,
                address,
                phone
            });
            return res.json({
                message: "Your order is successed!",
                createOrder: createOrder
            })

        } catch (error) {
            console.error("Order creation error:", error);

            return res.status(500).json({ message: "Your order is failed! Try again" })
        }
    },

    getOrders: async (req, res) => {
        const pageNo = parseInt(req.query.pageNo) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const totalCount = await Order.countDocuments()
        try {
            const orders = await Order.find()
                .populate('user_id', 'name')
                .populate('items.menu_id', "menu")
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize)
                .sort({ createdAt: -1 });;
            return res.json({
                orders,
                currentPage: pageNo,
                totalPages: Math.ceil(totalCount / pageSize),
                totalItems: totalCount,
            });
        } catch (error) {
            console.error("Get orders error:", error);
            return res.status(500).json({ message: "Failed to fetch orders." });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const allowedTransitions = {
                pending: ["successed", "canceled"],
                successed: ["delivered"],
                delivered: [],
                canceled: []
            };


            const currentStatus = order.status.toLowerCase();
            const newStatus = status.toLowerCase();

            if (!allowedTransitions[currentStatus].includes(newStatus)) {
                return res.status(400).json({ message: `Cannot change status from ${currentStatus} to ${newStatus}` });
            }

            order.status = newStatus;
            await order.save();

            res.json({ message: "Order status updated successfully", order });
        } catch (error) {
            console.error("Update order status error:", error);
            res.status(500).json({ message: "Failed to update order status" });
        }
    },

    orderHistory: async (req, res) => {
        try {

            const user_id = req.user._id;
            const pageNo = parseInt(req.query.pageNo) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;

            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const query = {
                user_id,
            };

            const totalCount = await Order.countDocuments(query)

            const orders = await Order.find(query)
                .populate("items.menu_id", "menu price")
                .sort({ createdAt: -1 })
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize);


            return res.json({
                orders,
                currentPage: pageNo,
                totalPages: Math.ceil(totalCount / pageSize),
                totalItems: totalCount
            });

        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch user orders" });
        }
    }

}

module.exports = OrderController;