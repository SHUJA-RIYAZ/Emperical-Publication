import { apiFetch } from "@/lib/api-client";
import { getUserToken } from "@/hooks/use-auth-store";
import type {
  AccountUser,
  AuthResult,
  MySubmission,
  ProfilePayload,
  RegisterPayload,
  UploadResult,
} from "@/types/account";

/** Adds the signed-in author's bearer token, when present. */
function authHeaders(): Record<string, string> {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerAccount(payload: RegisterPayload): Promise<AuthResult> {
  return apiFetch<AuthResult>("/auth/register", { method: "POST", body: payload });
}

export async function loginAccount(email: string, password: string): Promise<AuthResult> {
  return apiFetch<AuthResult>("/auth/login", { method: "POST", body: { email, password } });
}

export async function fetchCurrentAccount(): Promise<AccountUser> {
  return apiFetch<AccountUser>("/auth/me", { headers: authHeaders() });
}

export async function updateProfile(payload: ProfilePayload): Promise<AccountUser> {
  return apiFetch<AccountUser>("/auth/me", {
    method: "PATCH",
    body: payload,
    headers: authHeaders(),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
    headers: authHeaders(),
  });
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: { token, password },
  });
}

export async function getMySubmissions(): Promise<MySubmission[]> {
  return apiFetch<MySubmission[]>("/auth/submissions", { headers: authHeaders() });
}

/* ------------------------------------------------------------------ */
/* Wishlist (server-synced for signed-in authors)                      */
/* ------------------------------------------------------------------ */

export async function getServerWishlist(): Promise<string[]> {
  const result = await apiFetch<{ bookIds: string[] }>("/auth/wishlist", {
    headers: authHeaders(),
  });
  return result.bookIds;
}

export async function mergeServerWishlist(bookIds: string[]): Promise<string[]> {
  const result = await apiFetch<{ bookIds: string[] }>("/auth/wishlist", {
    method: "PUT",
    body: { bookIds: bookIds.map((id) => Number(id)).filter((n) => !Number.isNaN(n)) },
    headers: authHeaders(),
  });
  return result.bookIds;
}

export async function addServerWishlist(bookId: string): Promise<string[]> {
  const result = await apiFetch<{ bookIds: string[] }>(`/auth/wishlist/${bookId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  return result.bookIds;
}

export async function removeServerWishlist(bookId: string): Promise<string[]> {
  const result = await apiFetch<{ bookIds: string[] }>(`/auth/wishlist/${bookId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return result.bookIds;
}

/* ------------------------------------------------------------------ */
/* Manuscript upload                                                   */
/* ------------------------------------------------------------------ */

export async function uploadManuscript(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<UploadResult>("/uploads/manuscript", {
    method: "POST",
    rawBody: form,
    headers: authHeaders(),
    timeoutMs: 120000,
  });
}
