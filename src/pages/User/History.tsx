import { useEffect, useState } from "react";
import { useApiQuery } from "../../hook/useQuery";

interface OrderItem {
    _id: string;
    quantity: number;
    subtotal: number;
    menu_id: {
        _id: string;
        menu: string;
        price: number;
    } | null;
}

interface Order {
    _id: string;
    status: "successed" | "canceled" | string;
    createdAt: string;
    deliveryType: "delivery" | "takeaway" | "dinein" | string;
    paymentMethod: "cash" | "wavepay" | "kbzpay" | "card" | string;
    items: OrderItem[];
}

const History = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const userId = localStorage.getItem("user_id");

    const { data, refetch, isLoading } = useApiQuery({
        endpoint: `${import.meta.env.VITE_API_URL}/order-history?user_id=${userId}&pageNo=${page}&pageSize=3`,
    });

    useEffect(() => {
        if (data?.orders) {
            setOrders(data.orders);
            setTotalPages(data.totalPages || 1);
        }
    }, [data]);

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "successed":
                return "bg-green-100 text-green-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            case "takeaway":
            case "dinein":
            case "delivery":
                return "bg-blue-100 text-blue-800";
            case "cash":
            case "wavepay":
            case "kbzpay":
            case "card":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderSkeleton = () => (
        Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="border rounded-xl shadow-md p-6 bg-white animate-pulse space-y-4">
                <div className="h-6 w-1/4 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                </div>
                <div className="h-6 w-1/6 bg-gray-300 rounded mt-2"></div>
            </div>
        ))
    );

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };


    useEffect(() => {
        refetch();
    }, [page, refetch]);

    return (
        <div className="p-6 max-w-4xl mx-auto h-screen mt-4 flex flex-col">
            <h2 className="text-3xl font-bold mb-6 text-center">Order History</h2>
            {orders.length === 0 && (
                <p className="text-center text-gray-500">You have no orders yet.</p>
            )}

           <div className="flex-1 space-y-6 mb-4">
                {isLoading ? (
                    renderSkeleton()
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">You have no orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-300 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 bg-white"
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.deliveryType)}`}>
                                    {order.deliveryType.toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.paymentMethod)}`}>
                                    {order.paymentMethod.toUpperCase()}
                                </span>
                                <span className="ml-auto text-gray-500 text-sm">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="mb-3">
                                <strong>Items:</strong>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {order.items.map(item => (
                                        <li key={item._id} className="py-2 flex justify-between">
                                            <span>{item.menu_id?.menu || "Menu not found"} x {item.quantity}</span>
                                            <span className="font-medium">{item.subtotal} Ks</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end pt-3 border-t mt-3 font-bold text-lg">
                                Total: {order.items.reduce((acc, item) => acc + item.subtotal, 0)} Ks
                            </div>
                        </div>
                    ))
                )}
            </div>

          
            <div className="flex justify-center gap-4 mt-auto ">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 font-medium">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default History;
