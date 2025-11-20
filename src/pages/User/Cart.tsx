import { useState, useEffect } from "react";
import { useCartStore } from "../../store/Cart";
import { FaTrashAlt } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import Checkout from "../../components/Checkout";

const CartPage = () => {
  const { items, subtotal, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    setCheckout(true);
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-4 last:border-none animate-pulse"
        >
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-300 w-32 rounded"></div>
            <div className="h-4 bg-gray-200 w-24 rounded"></div>
          </div>

          <div className="flex items-center mt-3 sm:mt-0 gap-3">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex items-center mt-3 sm:mt-0 gap-4">
            <div className="h-5 w-16 bg-gray-300 rounded"></div>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-17">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {loading ? (
        renderSkeleton()
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow p-4" style={{ borderTop: "2px solid red", borderLeft: "2px solid red" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-4 last:border-none"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center mt-3 sm:mt-0 gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <FiMinus />
                  </button>

                  <span className="text-lg font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="flex items-center mt-3 sm:mt-0 gap-4">
                  <p className="font-semibold text-gray-800 w-20 text-right">
                    ${item.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Cart
            </button>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-700">
                Subtotal: <span className="text-red-500">${subtotal.toFixed(2)}</span>
              </p>

              <button
                type="submit"
                onClick={() => handleCheckout()}
                className="mt-3 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}

      {checkout && <Checkout onClose={() => setCheckout(false)} />}
    </div>
  );
};

export default CartPage;
