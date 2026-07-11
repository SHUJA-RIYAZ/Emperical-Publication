import { authors } from "@/data/authors";
import { books } from "@/data/books";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { Author, AuthorQuery, Book } from "@/types";
import { delay } from "./api";

export async function getAuthors(query: AuthorQuery = {}): Promise<Author[]> {
  try {
    return await apiFetch<Author[]>("/authors", {
      params: {
        search: query.search,
        country: query.country === "all" ? undefined : query.country,
        interest: query.interest === "all" ? undefined : query.interest,
      },
    });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    const { search, country, interest } = query;
    let result = [...authors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.institution.toLowerCase().includes(q) ||
          a.researchInterests.some((r) => r.toLowerCase().includes(q))
      );
    }
    if (country && country !== "all") result = result.filter((a) => a.country === country);
    if (interest && interest !== "all")
      result = result.filter((a) => a.researchInterests.includes(interest));
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    return await apiFetch<Author>(`/authors/${slug}`);
  } catch (error) {
    if (!isUnreachable(error)) return null;
    await delay(300);
    return authors.find((a) => a.slug === slug) ?? null;
  }
}

export async function getAuthorsByIds(ids: string[]): Promise<Author[]> {
  if (ids.length === 0) return [];
  try {
    return await apiFetch<Author[]>("/authors/by-ids", { params: { ids: ids.join(",") } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return authors.filter((a) => ids.includes(a.id));
  }
}

export async function getFeaturedAuthors(): Promise<Author[]> {
  try {
    return await apiFetch<Author[]>("/authors/featured");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return authors.filter((a) => a.featured);
  }
}

export async function getBooksByAuthor(author: Author): Promise<Book[]> {
  try {
    return await apiFetch<Book[]>(`/authors/${author.slug}/books`);
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return books.filter((b) => b.authorIds.includes(author.id));
  }
}

export async function getAuthorCountries(): Promise<string[]> {
  try {
    return await apiFetch<string[]>("/authors/countries");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return [...new Set(authors.map((a) => a.country))].sort();
  }
}
