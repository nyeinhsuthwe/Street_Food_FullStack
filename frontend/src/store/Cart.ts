import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    photo?: string;
    note?: string | null;
}

interface CartState {
    items: CartItem[];
    subtotal: number;
    note?: string | null
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setNote: (note: string | null) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            subtotal: 0,
            note: null,
            setNote: (note) => set({ note }),
            addToCart: (item: CartItem) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id && i.note === item.note);
                    let updatedItems;

                    if (existing) {
                        updatedItems = state.items.map((i) =>
                            i.id === item.id && i.note === item.note
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

            clearCart: () => set({ items: [], subtotal: 0, note: null }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
