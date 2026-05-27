import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  thumbnailUrl: string;
  quantity: number;
}

export interface CouponState {
  code: string;
  discount: number; // percentage
  minSpend: number;
}

interface CartStore {
  items: CartItem[];
  coupon: CouponState | null;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CouponState) => void;
  removeCoupon: () => void;
  getCartSubtotal: () => number;
  getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      
      addToCart: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      getCartSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal < coupon.minSpend) {
          return subtotal;
        }
        const discountAmount = (subtotal * coupon.discount) / 100;
        return subtotal - discountAmount;
      },
    }),
    {
      name: "miss-queen-cart", // local storage key
    }
  )
);
