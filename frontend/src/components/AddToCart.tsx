import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCartStore } from "../store/Cart";
import toast from "react-hot-toast";

interface AddToCartProps {
    menu: Inputs;
    onClose: () => void;
}

const AddToCart: React.FC<AddToCartProps> = ({ menu, onClose }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const totalPrice = (menu.price * quantity).toFixed(2);

    const handleConfirm = () => {
        addToCart({
            id: menu._id || "",
            name: menu.menu,
            price: menu.price,
            quantity,
            total: Number(totalPrice),
            photo: menu.photo,
        });
        toast.success(`${menu.menu} added to cart!`); 

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="relative card p-6 w-96">
                <button
                    onClick={onClose}
                    className="top-1 right-1 absolute text-accent hover:opacity-70"
                >
                    <FaTimes size={25} />
                </button>

                <img
                    src={
                        menu.photo
                            ? `${import.meta.env.VITE_API_URL}/uploads/${menu.photo}`
                            : "/no-photo.png"
                    }
                    alt={menu.menu}
                    className="w-full h-48 object-cover mb-4 rounded"
                />

                <div className="flex gap-3 justify-between">
                    <h2 className="text-md w-[130px] mb-4 border-b-2 border-accent py-2 font-semibold text-center">
                        {menu.menu}
                    </h2>

                    <p className="text-sm w-[130px] mb-4 rounded-2xl bg-accent py-2 font-semibold text-white text-center">
                        Price: ${menu.price.toFixed(2)}
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-4 mt-8">
                    <p className="text-[color:var(--muted)]">Choose Qty:</p>
                    <button
                        onClick={handleDecrease}
                        className="bg-surface-2 px-3 py-1 rounded hover:shadow-sm"
                    >
                        -
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="bg-surface-2 px-3 py-1 rounded hover:shadow-sm"
                    >
                        +
                    </button>
                </div>

                <p className="font-semibold mb-4">
                    Total: <span className="text-accent">${totalPrice}</span>
                </p>

                <button
                    onClick={handleConfirm}
                    className="w-full btn-primary"
                >
                    Confirm Add to Cart
                </button>
            </div>
        </div>
    );
};

export default AddToCart;
