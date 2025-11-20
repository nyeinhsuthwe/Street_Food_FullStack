import { useQueryClient } from "@tanstack/react-query";
import { colors } from "../constant/color";
import { useApiMutation } from "../hook/useMutation";
import { useState } from "react";

interface OrderDetailsProps {
    order: Order;
    onClose: () => void;
}

type OrderStatus = 'pending' | 'successed' | 'delivered' | 'canceled';


const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
    const queryClient = useQueryClient();
    const [orderStatus, setOrderStatus] = useState(order.status)


    const statusOptions: Record<OrderStatus, string[]> = {
        pending: ["successed", "canceled"],
        successed: ["delivered"],
        delivered: [],
        canceled: [],
    };

    const currentStatus = (orderStatus?.toLowerCase() || "pending") as OrderStatus;


    const updateMutation = useApiMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const handleStatusUpdate = (newStatus: string) => {
        setOrderStatus(newStatus)
        updateMutation.mutate({
            endpoint: `${import.meta.env.VITE_API_URL}/update-status/${order._id}`,
            method: "PATCH",
            body: { status: newStatus }
        })
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-orange/40 backdrop-blur-sm">
            <div className="rounded-3xl border border-green-500 p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: colors.bg }}>

                <div className="flex flex-col justify-between  mb-6  pb-3">
                    <h3 className="text-2xl font-bold" style={{ color: colors.accent }}>
                        {order.user_id.name}'s Order

                    </h3>
                   
                    <div
                        className="p-4 rounded-xl  flex flex-col items-start"
                       
                    >
                        <p className="text-sm text-gray-600 font-bold mb-1">Contact Info</p>

                      
                        <p className="text-lg font-bold text-red-600">
                            📞 {order.phone || "No phone number"}
                        </p>

                      
                        {order.deliveryType === "delivery" && (
                            <p className="text-lg font-bold text-purple-600 mt-1">
                                🏠 {order.address || "No address provided"}
                            </p>
                        )}
                    </div>


                </div>


                <div className="overflow-x-auto ">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-100 text-gray-700 " style={{ backgroundColor: colors.card, color: colors.bg }}>
                            <tr>
                                <th className="p-3 text-left">Menu</th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-center">Price</th>
                                <th className="p-3 text-center">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {order.items.map((item) => (
                                <tr key={item._id} className="transition-colors">
                                    <td className="p-3 font-bold" style={{ color: colors.card }}>{item.menu_id.menu}</td>
                                    <td className="p-3 font-bold text-center" style={{ color: colors.card }}>{item.quantity}</td>
                                    <td className="p-3 font-bold text-center" style={{ color: colors.card }}>{item.price.toLocaleString()}</td>
                                    <td className="p-3 font-bold text-center" style={{ color: colors.card }}>{item.subtotal.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div
                        className="p-4 rounded-xl shadow-md flex flex-col items-center justify-center border-l-4 border-green-700"
                        style={{ backgroundColor: colors.egg }}
                    >
                        <p className="text-sm text-gray-600 font-bold">Total</p>
                        <p className="text-lg font-bold text-red-500 ">
                            {order.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
                        </p>
                    </div>


                    <div
                        className="p-4 rounded-xl shadow-md flex flex-col border-l-4 border-red-700 items-center justify-center"
                        style={{ backgroundColor: colors.egg }}
                    >
                        <p className="text-sm text-gray-600 font-bold">Order Status</p>
                        <p
                            className={`text-lg font-bold ${orderStatus?.toLowerCase() === "pending"
                                ? "text-yellow-500"
                                : orderStatus?.toLowerCase() === "delivered"
                                    ? "text-blue-500"
                                    : orderStatus?.toLowerCase() === "canceled"
                                        ? "text-red-500"
                                        : "text-green-500"
                                }`}
                        >
                            {orderStatus?.toUpperCase() || "PENDING"}
                        </p>

                        <div className="flex gap-2 mt-2 ">
                            {statusOptions[currentStatus]?.map((s) => (
                                <button
                                    key={s}
                                    className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={() => handleStatusUpdate(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>



                    <div
                        className="p-4 rounded-xl shadow-md flex flex-col items-center justify-center border-l-4 border-blue-700"
                        style={{ backgroundColor: colors.egg }}
                    >
                        <p className="text-sm text-gray-600 font-bold">Delivery Type</p>
                        <p className="text-lg font-bold text-green-600">{order.deliveryType || "Takeaway"}</p>
                    </div>


                    <div
                        className="p-4 rounded-xl shadow-md border-l-4 border-yellow-500 flex flex-col items-center justify-center"
                        style={{ backgroundColor: colors.egg }}
                    >
                        <p className="text-sm text-gray-600 font-bold">Payment Method</p>
                        <p className="text-lg font-bold text-blue-500">{order.paymentMethod || "Mobile"}</p>

                    </div>


                </div>




                <div className="flex justify-end mt-6">
                    <button
                        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
