import { useState } from "react";

interface PaymentModalProps {
    method: string;
    amount: number;
    onPaid: () => void;
    onClose: () => void;
}

const PaymentModal = ({ method, amount, onPaid, onClose }: PaymentModalProps) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onPaid();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

                <h2 className="text-xl font-bold mb-4">Pay with {method}</h2>

                <p className="mb-2">Amount: <strong>{amount} Ks</strong></p>

                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-600 mb-4">
                    QR Code Here
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white rounded-lg"
                >
                    {loading ? "Processing..." : "I Have Paid"}
                </button>

                <button
                    onClick={onClose}
                    className="w-full py-2 mt-2 bg-gray-300 rounded-lg"
                >
                    Cancel
                </button>

            </div>
        </div>
    );
};

export default PaymentModal;
