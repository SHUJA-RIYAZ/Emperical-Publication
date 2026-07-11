import { journals } from "@/data/journals";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { Journal } from "@/types";
import { delay } from "./api";

export async function getJournals(search?: string): Promise<Journal[]> {
  try {
    return await apiFetch<Journal[]>("/journals", { params: { search } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    let result = [...journals];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) => j.title.toLowerCase().includes(q) || j.field.toLowerCase().includes(q)
      );
    }
    return result;
  }
}

export async function getJournalBySlug(slug: string): Promise<Journal | null> {
  try {
    return await apiFetch<Journal>(`/journals/${slug}`);
  } catch (error) {
    if (!isUnreachable(error)) return null;
    return journals.find((j) => j.slug === slug) ?? null;
  }
}

export async function getFeaturedJournals(limit = 6): Promise<Journal[]> {
  try {
    return await apiFetch<Journal[]>("/journals/featured", { params: { limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return [...journals].sort((a, b) => b.impactFactor - a.impactFactor).slice(0, limit);
  }
}
