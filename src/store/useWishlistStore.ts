import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  thumbnailUrl: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      toggleWishlist: (item) => {
        const isFav = get().isInWishlist(item.id);
        if (isFav) {
          get().removeFromWishlist(item.id);
        } else {
          get().addToWishlist(item);
        }
      },
    }),
    {
      name: "miss-queen-wishlist", // local storage key
    }
  )
);
