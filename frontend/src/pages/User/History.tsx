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
                return "bg-accent-2 text-white";
            case "canceled":
                return "bg-accent text-white";
            case "takeaway":
            case "dinein":
            case "delivery":
                return "bg-accent-3 text-[color:var(--text)]";
            case "cash":
            case "wavepay":
            case "kbzpay":
            case "card":
                return "bg-surface-2 text-[color:var(--text)]";
            default:
                return "bg-surface-2 text-[color:var(--text)]";
        }
    };

    const renderSkeleton = () => (
        Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="card p-6 animate-pulse space-y-4">
                <div className="h-6 w-1/4 bg-[color:var(--border)] rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-[color:var(--border)] rounded"></div>
                    <div className="h-4 w-full bg-surface-2 rounded"></div>
                    <div className="h-4 w-1/2 bg-[color:var(--border)] rounded"></div>
                </div>
                <div className="h-6 w-1/6 bg-[color:var(--border)] rounded mt-2"></div>
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
        <div className="p-6 max-w-4xl mx-auto min-h-screen mt-4 flex flex-col">
            <h2 className="section-title mb-6 text-center">Order History</h2>
            <div className="flex-1 space-y-6 mb-4">
                {isLoading ? (
                    renderSkeleton()
                ) : orders.length === 0 ? (
                    <p className="text-center text-[color:var(--muted)]">You have no orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="card p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.status || "pending")}`}>
                                    {(order.status || "pending").toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.deliveryType || "takeaway")}`}>
                                    {(order.deliveryType || "takeaway").toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(order.paymentMethod || "cash")}`}>
                                    {(order.paymentMethod || "cash").toUpperCase()}
                                </span>
                                <span className="ml-auto text-[color:var(--muted)] text-sm">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>


                            <div className="mb-3">
                                <strong>Items:</strong>
                                <ul className="mt-2 divide-y divide-[color:var(--border)]">
                                    {order.items.map(item => (
                                        <li key={item._id} className="py-2 flex justify-between">
                                            <span>{item.menu_id?.menu || "Menu not found"} x {item.quantity}</span>
                                            <span className="font-medium">{item.subtotal} Ks</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end pt-3 border-t border-soft mt-3 font-bold text-lg">
                                Total: {order.items.reduce((acc, item) => acc + item.subtotal, 0)} Ks
                            </div>
                        </div>
                    ))
                )}
            </div>


            <div className="flex justify-center gap-4 mt-8 mb-4">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="btn-ghost disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 font-medium">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="btn-ghost disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default History;
