import { useCartStore } from "../store/Cart";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useApiMutation } from "../hook/useMutation";
import toast from "react-hot-toast";
import PaymentModal from "./PaymentModal";
import { AiOutlinePhone } from "react-icons/ai";


type CheckoutProps = {
    onClose: () => void;
};

interface CheckoutFormData {
    deliveryType: "takeaway" | "dinein" | "delivery";
    paymentMethod: "cash" | "wavepay" | "kbzpay" | "card";
    phone: string;
    address?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
    const { subtotal, items, clearCart } = useCartStore();
    const [deliveryType, setDeliveryType] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cachedData, setCachedData] = useState<CheckoutFormData | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>();

    const checkoutMutation = useApiMutation({
        onSuccess: () => {
            toast.success("Your order is successed!");
            clearCart();
            onClose();
        }
    });

    const createOrder = (data: CheckoutFormData) => {
        const userId = localStorage.getItem("user_id");

        const orderItems = items.map(item => ({
            menu_id: item.id,
            quantity: item.quantity,
        }));

        const body = {
            ...data,
            user_id: userId,
            items: orderItems,
            subtotal,
        };

        checkoutMutation.mutate({
            endpoint: `${import.meta.env.VITE_API_URL}/create-order`,
            method: "POST",
            body
        });
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (data.paymentMethod === "wavepay" || data.paymentMethod === "kbzpay") {
            setCachedData(data);
            setShowPaymentModal(true);
            return;
        }
        createOrder(data);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                    <button className="text-gray-500" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-5">
                        <h3 className="text-sm font-semibold mb-2">Delivery Type</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {["takeaway", "dinein", "delivery"].map(type => (
                                <label
                                    key={type}
                                    className={`border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${deliveryType === type ? "bg-red-100 border-red-500" : ""
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={type}
                                        {...register("deliveryType")}
                                        onChange={(e) => setDeliveryType(e.target.value)}
                                        className="mr-2"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-5">
                        <h3 className="text-sm font-semibold mb-2">Contact Info</h3>

                        <div className="relative">
                            <AiOutlinePhone
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^(09|\+959)\d{7,9}$/,
                                        message: "Invalid Myanmar phone number",
                                    },
                                })}
                                className="w-full pl-10 border px-3 py-2 rounded-lg"
                            />
                        </div>

                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>


                    {deliveryType === "delivery" && (
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold mb-2">Address</h3>
                            <textarea
                                {...register("address")}
                                placeholder="Enter address"
                                className="w-full border px-3 py-2 rounded-lg"
                                rows={3}
                            />
                        </div>
                    )}

                    <div className="mb-5">
                        <h3 className="text-sm font-semibold mb-2">Payment Method</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["cash", "wavepay", "kbzpay", "card"].map(pm => (
                                <label
                                    key={pm}
                                    className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-gray-100"
                                >
                                    <input
                                        type="radio"
                                        value={pm}
                                        {...register("paymentMethod")}
                                        className="mr-2"
                                    />
                                    {pm}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-semibold mb-2">Order Summary</h3>
                        <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total</span>
                            <span>{subtotal} Ks</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="w-1/2 py-2 rounded-lg border border-gray-400 text-gray-600"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="w-1/2 py-2 rounded-lg bg-red-600 text-white font-semibold"
                        >
                            Confirm Order
                        </button>
                    </div>

                </form>
            </div>

            {showPaymentModal && cachedData && (
                <PaymentModal
                    method={watch("paymentMethod")}
                    amount={subtotal}
                    onPaid={() => {
                        setShowPaymentModal(false);
                        createOrder(cachedData);
                    }}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}

        </div>
    );
};

export default Checkout;
