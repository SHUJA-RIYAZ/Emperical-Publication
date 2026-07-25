"use client";

import { apiFetch, ApiError } from "./api-client";
import { withBasePath } from "./navigation";

const TOKEN_KEY = "eip-admin-token";
const USER_KEY = "eip-admin-user";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function storeAdminSession(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Authenticated fetch for admin endpoints. Throws ApiError on failure. */
export async function adminFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; params?: Record<string, string | number | undefined> } = {}
): Promise<T> {
  const token = getAdminToken();
  try {
    return await apiFetch<T>(path, {
      ...options,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      timeoutMs: 15000,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearAdminSession();
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin/login")) {
        window.location.href = withBasePath("/admin/login");
      }
    }
    throw error;
  }
}

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const result = await apiFetch<{ accessToken: string; user: AdminUser }>("/admin/login", {
    method: "POST",
    body: { email, password },
  });
  storeAdminSession(result.accessToken, result.user);
  return result.user;
}
