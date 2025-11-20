import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    photo?: string;
}

interface CartState {
    items: CartItem[];
    subtotal: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            subtotal: 0,

            addToCart: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    let updatedItems;

                    if (existing) {
                        updatedItems = state.items.map((i) =>
                            i.id === item.id
                                ? {
                                    ...i,
                                    quantity: i.quantity + item.quantity,
                                    total: (i.quantity + item.quantity) * i.price,
                                }
                                : i
                        );
                    } else {
                        updatedItems = [...state.items, item];
                    }

                    const newSubtotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
                    return { items: updatedItems, subtotal: newSubtotal };
                }),

            removeFromCart: (id) =>
                set((state) => {
                    const updatedItems = state.items.filter((item) => item.id !== id);
                    const newSubtotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
                    return { items: updatedItems, subtotal: newSubtotal };
                }),

            updateQuantity: (id, quantity) =>
                set((state) => {
                    const updatedItems = state.items.map((i) =>
                        i.id === id ? { ...i, quantity, total: quantity * i.price } : i
                    );
                    const newSubtotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
                    return { items: updatedItems, subtotal: newSubtotal };
                }),

            clearCart: () => set({ items: [], subtotal: 0 }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
