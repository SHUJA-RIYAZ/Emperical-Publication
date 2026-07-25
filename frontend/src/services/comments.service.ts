import { getUserToken } from "@/hooks/use-auth-store";
import { apiFetch } from "@/lib/api-client";

export interface BlogComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

export interface CommentPayload {
  name: string;
  email: string;
  body: string;
}

export async function getComments(slug: string): Promise<BlogComment[]> {
  return apiFetch<BlogComment[]>(`/blogs/${slug}/comments`);
}

export async function postComment(
  slug: string,
  payload: CommentPayload
): Promise<{ message: string }> {
  const token = getUserToken();
  return apiFetch<{ message: string }>(`/blogs/${slug}/comments`, {
    method: "POST",
    body: payload,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
