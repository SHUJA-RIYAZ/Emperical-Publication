import { apiFetch, isUnreachable } from "@/lib/api-client";

export type SearchHitType = "book" | "author" | "journal" | "blog";

export interface SearchHit {
  type: SearchHitType;
  title: string;
  subtitle: string;
  slug: string;
}

export interface SearchResults {
  books: SearchHit[];
  authors: SearchHit[];
  journals: SearchHit[];
  blogs: SearchHit[];
  total: number;
}

const EMPTY: SearchResults = { books: [], authors: [], journals: [], blogs: [], total: 0 };

/** Site-wide search across books, authors, journals and blog posts. */
export async function searchSite(query: string, limit = 4): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return EMPTY;
  try {
    return await apiFetch<SearchResults>("/search", { params: { q, limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return EMPTY;
  }
}
