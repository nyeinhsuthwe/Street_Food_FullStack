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
    billPhoto?: FileList;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
    const { subtotal, items, clearCart } = useCartStore();
    const [deliveryType, setDeliveryType] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cachedData, setCachedData] = useState<CheckoutFormData | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>();
    const paymentMethod = watch("paymentMethod");
    const requiresBill = paymentMethod === "wavepay" || paymentMethod === "kbzpay";

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
            deliveryType: data.deliveryType,
            paymentMethod: data.paymentMethod,
            phone: data.phone,
            address: data.address,
            user_id: userId,
            items: orderItems,
            subtotal,
        };

        const billFile = data.billPhoto?.[0];
        if (billFile) {
            const formData = new FormData();
            formData.append("payment_bill", billFile);
            formData.append("deliveryType", body.deliveryType);
            formData.append("paymentMethod", body.paymentMethod);
            formData.append("phone", body.phone);
            if (body.address) formData.append("address", body.address);
            formData.append("user_id", body.user_id ?? "");
            formData.append("subtotal", String(body.subtotal));
            formData.append("items", JSON.stringify(body.items));

            checkoutMutation.mutate({
                endpoint: `${import.meta.env.VITE_API_URL}/create-order`,
                method: "POST",
                body: formData
            });
            return;
        }

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

            <div className="card w-full max-w-lg p-6">

                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold">Checkout</h2>
                    <button className="text-[color:var(--muted)]" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-5">
                        <h3 className="text-sm font-semibold mb-2">Delivery Type</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {["takeaway", "dinein", "delivery"].map(type => (
                                <label
                                    key={type}
                                    className={`border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-surface-2 ${deliveryType === type ? "bg-accent-3 border-accent-3 text-[color:var(--text)]" : "bg-surface border-soft"
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
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted)]"
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
                                className="w-full pl-10 input"
                            />
                        </div>

                        {errors.phone && (
                            <p className="text-accent text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>


                    {deliveryType === "delivery" && (
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold mb-2">Address</h3>
                            <textarea
                                {...register("address")}
                                placeholder="Enter address"
                                className="w-full input"
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
                                    className="border rounded-lg p-3 flex items-center cursor-pointer hover:bg-surface-2 bg-surface border-soft"
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

                    {requiresBill && (
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold mb-2">Payment Bill</h3>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("billPhoto", {
                                    validate: (files) => {
                                        if (!requiresBill) return true;
                                        return files && files.length > 0 ? true : "Payment bill is required";
                                    },
                                })}
                                className="w-full input"
                            />
                            {errors.billPhoto && (
                                <p className="text-accent text-sm mt-1">{errors.billPhoto.message}</p>
                            )}
                        </div>
                    )}

                    <div className="bg-surface-2 p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-semibold mb-2">Order Summary</h3>
                        <div className="flex justify-between font-bold border-t border-soft pt-2">
                            <span>Total</span>
                            <span>{subtotal} Ks</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="w-1/2 btn-ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="w-1/2 btn-primary"
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
