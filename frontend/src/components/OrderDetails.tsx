import { useQueryClient } from "@tanstack/react-query";
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
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm">
            <div className="card p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-y-auto shadow-2xl">

                <div className="flex flex-col justify-between  mb-6  pb-3">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-bold text-accent">
                             {order.user_id?.name ?? "Deleted User"}'s Order

                        </h3>
                        <p className="text-[color:var(--muted)]"> {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div
                        className="p-4 rounded-xl  flex flex-col items-start"

                    >
                        <p className="text-sm text-[color:var(--muted)] font-bold mb-1">Contact Info</p>


                        <p className="text-md font-bold text-accent">
                            📞 {order.phone || "No phone number"}
                        </p>


                        {order.deliveryType === "delivery" && (
                            <p className="text-md font-bold text-accent-2 mt-1">
                                🏠 {order.address || "No address provided"}
                            </p>
                        )}
                    </div>


                </div>


                <div className="overflow-x-auto text-sm">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-surface-2 text-[color:var(--text)]">
                            <tr>
                                <th className="p-3 text-left">Menu</th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-center">Price</th>
                                <th className="p-3 text-center">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[color:var(--border)]">
                            {order.items.map((item) => (
                                <tr key={item._id} className="transition-colors">
                                    <td className="p-3 font-bold">{item.menu_id?.menu || "Deleted Menu"}
                                    </td>
                                    <td className="p-3 font-bold text-center">{item.quantity}</td>
                                    <td className="p-3 font-bold text-center">{item.price.toLocaleString() || 0}</td>
                                    <td className="p-3 font-bold text-center">{item.subtotal.toLocaleString() || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div
                        className="card-soft p-4 shadow-md flex flex-col items-center justify-center border-l-4 border-accent-2"
                    >
                        <p className="text-sm text-[color:var(--muted)] font-bold">Total</p>
                        <p className="text-md font-bold text-accent">
                            {order.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
                        </p>
                    </div>


                    <div
                        className="card-soft p-4 shadow-md flex flex-col border-l-4 border-accent items-center justify-center"
                    >
                        <p className="text-sm text-[color:var(--muted)] font-bold">Order Status</p>
                        <p
                            className={`text-md font-bold ${orderStatus?.toLowerCase() === "pending"
                                ? "text-accent-3"
                                : orderStatus?.toLowerCase() === "delivered"
                                    ? "text-accent-2"
                                    : orderStatus?.toLowerCase() === "canceled"
                                        ? "text-accent"
                                        : "text-accent-2"
                                }`}
                        >
                            {orderStatus?.toUpperCase() || "PENDING"}
                        </p>

                        <div className="flex gap-2 mt-2 ">
                            {statusOptions[currentStatus]?.map((s) => (
                                <button
                                    key={s}
                                    className="px-3 py-1 rounded-full bg-accent-2 text-white hover:opacity-80"
                                    onClick={() => handleStatusUpdate(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>



                    <div
                        className="card-soft p-4 shadow-md flex flex-col items-center justify-center border-l-4 border-accent-3"
                    >
                        <p className="text-sm text-[color:var(--muted)] font-bold">Delivery Type</p>
                        <p className="text-md font-bold text-accent-2">{order.deliveryType || "Takeaway"}</p>
                    </div>


                    <div
                        className="card-soft p-4 shadow-md border-l-4 border-accent-3 flex flex-col items-center justify-center"
                    >
                        <p className="text-sm text-[color:var(--muted)] font-bold">Payment Method</p>
                        <p className="text-md font-bold text-accent-2">{order.paymentMethod || "Mobile"}</p>

                    </div>
                </div>

                {order.paymentBill && (
                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-[color:var(--muted)] mb-2">Payment Bill</h4>
                        <div className="card p-4">
                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/${order.paymentBill}`}
                                alt="Payment bill"
                                className="w-full max-h-[420px] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}


                <div className="flex justify-end mt-6">
                    <button
                        className="btn-primary"
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
