"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addServerWishlist, removeServerWishlist } from "@/services/account.service";
import { useAuthStore } from "./use-auth-store";

interface WishlistState {
  bookIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  /** Adopts a server-provided list (after sign-in or a sync). */
  replaceAll: (ids: string[]) => void;
  clear: () => void;
}

/**
 * Wishlist state. Guests keep it in localStorage; signed-in authors also have
 * every change mirrored to their account so it follows them across devices.
 * Local state updates optimistically — a failed sync never blocks the UI.
 */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      bookIds: [],
      toggle: (id) => {
        const wasSaved = get().bookIds.includes(id);
        set((state) => ({
          bookIds: wasSaved ? state.bookIds.filter((b) => b !== id) : [...state.bookIds, id],
        }));

        if (useAuthStore.getState().token) {
          const sync = wasSaved ? removeServerWishlist : addServerWishlist;
          sync(id)
            .then((ids) => set({ bookIds: ids }))
            .catch(() => {
              /* keep the optimistic local state */
            });
        }
      },
      has: (id) => get().bookIds.includes(id),
      replaceAll: (ids) => set({ bookIds: ids }),
      clear: () => set({ bookIds: [] }),
    }),
    { name: "eip-wishlist" }
  )
);
