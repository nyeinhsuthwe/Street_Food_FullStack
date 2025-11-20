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
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
                <button
                    onClick={onClose}
                    className="top-1 right-1 absolute text-red-500 hover:text-red-300"
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
                    <h2 className="text-md w-[130px] mb-4 border-b-2 border-red-500 py-2 font-semibold text-gray-800 text-center">
                        {menu.menu}
                    </h2>

                    <p className="text-sm w-[130px] mb-4 rounded-2xl bg-red-500 py-2 font-semibold text-white text-center">
                        Price: ${menu.price.toFixed(2)}
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-4 mt-8">
                    <p className="text-gray-600">Choose Qty:</p>
                    <button
                        onClick={handleDecrease}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        -
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                        onClick={handleIncrease}
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        +
                    </button>
                </div>

                <p className="text-gray-700 font-semibold mb-4">
                    Total: <span className="text-red-500">${totalPrice}</span>
                </p>

                <button
                    onClick={handleConfirm}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-medium"
                >
                    Confirm Add to Cart
                </button>
            </div>
        </div>
    );
};

export default AddToCart;
