import { useState } from "react";
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
        <div className="p-6 h-full w-full overflow-y-auto">
            <div className="flex flex-wrap items-center gap-6 w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    Order List
                </h2>

                <div className="">
                    <select
                        value={selectedOrderStatus}
                        onChange={(e) => setSelectedOrderStatus(e.target.value)}
                        className="input text-sm"
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
                    <div className="overflow-hidden mt-4 rounded-2xl w-5xl mx-auto card" style={{ height: "710px" }}>
                        <table className="w-full text-xs">
                            <thead className="bg-accent text-white">
                                <tr>
                                    <th className="p-4 text-center">Customer Name</th>
                                    <th className="p-4 text-center">Items</th>
                                    <th className="p-4 text-center">Total</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="bg-surface">
                                {filter?.map((order: Order) => (
                                    <tr
                                        key={order._id}
                                        className={`transition-transform duration-200 ease-in-out cursor-pointer ${activeOrderId === order._id ? "transform scale-105 shadow-sm" : "hover:scale-105"
                                            }`}
                                        style={{ borderBottom: "1px solid var(--border)" }}
                                    >
                                        <td className="text-center font-medium p-4">
                                            {order.user_id?.name ?? "Deleted User"}
                                        </td>

                                        <td className="text-center font-medium">
                                            {order.items.length} item(s)
                                        </td>

                                        <td className="text-center font-medium">
                                            {order.items.reduce((sum, item) => sum + item.subtotal, 0)}
                                        </td>

                                        <td className={`text-center font-medium ${order.status?.toLowerCase() === "pending"
                                            ? "text-accent-3"
                                            : order.status?.toLowerCase() === "delivered"
                                                ? "text-accent-2"
                                                : order.status?.toLowerCase() === "canceled"
                                                    ? "text-accent"
                                                    : "text-accent-2"
                                            }`} >
                                            {order.status.toUpperCase()}
                                        </td>

                                        <td className="text-center ">
                                            <button
                                                type="button"
                                                className="text-lg mr-2 text-accent-2"
                                                onClick={() => handleOrderDetail(order)}
                                            >
                                               <CgMoreO/>
                                            </button>
                                               <button
                                                type="button"
                                                className="text-lg mr-2 text-accent"
                                                onClick={() => handleDelete(order._id!)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex mr-1 justify-end items-center px-4 gap-4 mt-8 mb-4">
                            <span className="font-medium text-[color:var(--muted)]">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="btn-secondary disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <button
                                onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                                disabled={currentPage === totalPages}
                                className="btn-secondary disabled:opacity-50"
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
