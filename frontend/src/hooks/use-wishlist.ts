"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  bookIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      bookIds: [],
      toggle: (id) =>
        set((state) => ({
          bookIds: state.bookIds.includes(id)
            ? state.bookIds.filter((b) => b !== id)
            : [...state.bookIds, id],
        })),
      has: (id) => get().bookIds.includes(id),
      clear: () => set({ bookIds: [] }),
    }),
    { name: "eip-wishlist" }
  )
);
