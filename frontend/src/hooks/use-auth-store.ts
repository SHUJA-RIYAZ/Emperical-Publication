"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withBasePath } from "@/lib/navigation";
import type { AccountUser } from "@/types/account";

interface AuthState {
  token: string | null;
  user: AccountUser | null;
  setSession: (token: string, user: AccountUser) => void;
  setUser: (user: AccountUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    { name: "eip-author-session" }
  )
);

/**
 * False during SSR and the first client render, true afterwards.
 *
 * zustand's persist middleware rehydrates from localStorage synchronously when
 * the store module loads, so once the component has mounted on the client the
 * session is already accurate. This also keeps server and first-client render
 * identical, avoiding hydration mismatches.
 */
export function useAuthHydrated(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Non-reactive token accessor for service functions. */
export function getUserToken(): string | null {
  return useAuthStore.getState().token;
}

/** Clears the session and sends the visitor to the sign-in page. */
export function signOutAndRedirect(): void {
  useAuthStore.getState().clearSession();
  if (typeof window !== "undefined") window.location.href = withBasePath("/login");
}
