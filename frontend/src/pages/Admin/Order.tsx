import { useState } from "react";
import { colors } from "../../constant/color";
import { useApiQuery } from "../../hook/useQuery";
import { FaTrash } from "react-icons/fa";
import { CgMoreO } from "react-icons/cg";
import OrderDetails from "../../components/OrderDetails";
import { OrderSkeleton } from "../../constant/skeleton";
import { useApiMutation } from "../../hook/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function Order() {
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [activeOrderId] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("All");
    const queryClient = useQueryClient()

    const { data: orderData, isLoading } = useApiQuery(
        {
            queryKey: ["orders", page, limit, selectedOrderStatus],
            endpoint: `${import.meta.env.VITE_API_URL}/get-order-list?pageNo=${page}&pageSize=${limit}`,
        },
        {
            select: (res: ApiResponse<Order[]>) => res,
            keepPreviousData: true
        },
    );

    const deleteOrder = useApiMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
             toast.success("Order deleted successfully!")
        }
        
    })

    const handleDelete = (id : string) => {
        deleteOrder.mutate({
            endpoint: `${import.meta.env.VITE_API_URL}/delete-order/${id}`,
            method : "DELETE"
        })
       
    }

    const orders = orderData?.orders || [];
    const currentPage = orderData?.currentPage || 1;
    const totalPages = orderData?.totalPages || 1;

    const handleOrderDetail = (orders: Order) => {
        setOrderDetail(orders);
    }

    const filter: Order[] = selectedOrderStatus === "All"
        ? orders
        : orders.filter((order: Order) => order.status?.toLowerCase() === selectedOrderStatus.toLowerCase());

    return (
        <div className="p-8 h-full pt-15 w-full overflow-y-auto" style={{ backgroundColor: colors.bg }}>
            <div className="flex space-x-6 w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                    📦 Order List
                </h2>

                <div className="">
                    <select
                        value={selectedOrderStatus}
                        onChange={(e) => setSelectedOrderStatus(e.target.value)}
                        className="border text-[#7f6743] rounded px-3 py-2 text-sm"
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Successed">Successed</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <OrderSkeleton />
            ) : (
                <>
                    <div className="overflow-hidden mt-4 rounded-2xl w-5xl mx-auto" style={{ height: "710px" }}>
                        <table className="w-full text-xs">
                            <thead style={{ backgroundColor: colors.accent, color: colors.white }}>
                                <tr>
                                    <th className="p-4 text-center">Customer Name</th>
                                    <th className="p-4 text-center">Items</th>
                                    <th className="p-4 text-center">Total</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="bg-amber-50">
                                {filter?.map((order: Order) => (
                                    <tr
                                        key={order._id}
                                        className={`transition-transform duration-200 ease-in-out cursor-pointer ${activeOrderId === order._id ? "transform scale-105 shadow-sm" : "hover:scale-105"
                                            }`}
                                        style={{ borderBottom: `2px solid ${colors.bg}` }}
                                    >
                                        <td className="text-center font-medium p-4" style={{ color: colors.text }}>
                                            {order.user_id?.name ?? "Deleted User"}
                                        </td>

                                        <td className="text-center font-medium" style={{ color: colors.text }}>
                                            {order.items.length} item(s)
                                        </td>

                                        <td className="text-center font-medium" style={{ color: colors.text }}>
                                            {order.items.reduce((sum, item) => sum + item.subtotal, 0)}
                                        </td>

                                        <td className={`text-center font-medium ${order.status?.toLowerCase() === "pending"
                                            ? "text-yellow-500"
                                            : order.status?.toLowerCase() === "delivered"
                                                ? "text-gray-500"
                                                : order.status?.toLowerCase() === "canceled"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`} >
                                            {order.status.toUpperCase()}
                                        </td>

                                        <td className="text-center ">
                                            <button
                                                type="button"
                                                className="text-lg mr-2 text-green-600"
                                                onClick={() => handleOrderDetail(order)}
                                            >
                                               <CgMoreO/>
                                            </button>
                                               <button
                                                type="button"
                                                className="text-lg mr-2 text-red-600"
                                                onClick={() => handleDelete(order._id!)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex  mr-1 justify-end items-center gap-4 mt-4 ">
                            <span className="font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <button
                                onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-green-400 rounded hover:bg-green-500 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {orderDetail && (
                <OrderDetails
                    order={orderDetail}
                    onClose={() => setOrderDetail(null)}
                />
            )}
        </div>
    );
}