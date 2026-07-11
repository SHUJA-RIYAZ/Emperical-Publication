import { books } from "@/data/books";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { Book, BookQuery, PaginatedResult } from "@/types";
import { delay } from "./api";

const DEFAULT_PAGE_SIZE = 12;

/* ------------------------------------------------------------------ */
/* Mock fallbacks — used automatically when the API is unreachable.    */
/* ------------------------------------------------------------------ */

function mockGetBooks(query: BookQuery): PaginatedResult<Book> {
  const {
    search,
    category,
    language,
    year,
    sort = "newest",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = query;

  let result = [...books];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (category && category !== "all") result = result.filter((b) => b.category === category);
  if (language && language !== "all") result = result.filter((b) => b.language === language);
  if (year && year !== "all") result = result.filter((b) => String(b.publicationYear) === year);

  const sorters: Record<NonNullable<BookQuery["sort"]>, (a: Book, b: Book) => number> = {
    newest: (a, b) => b.publicationDate.localeCompare(a.publicationDate),
    oldest: (a, b) => a.publicationDate.localeCompare(b.publicationDate),
    "title-asc": (a, b) => a.title.localeCompare(b.title),
    "title-desc": (a, b) => b.title.localeCompare(a.title),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  result.sort(sorters[sort]);

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  return {
    items: result.slice((safePage - 1) * pageSize, safePage * pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function mockRelated(book: Book, limit: number): Book[] {
  return books
    .filter((b) => b.id !== book.id)
    .sort((a, b) => {
      const score = (x: Book) =>
        (x.category === book.category ? 2 : 0) + x.tags.filter((t) => book.tags.includes(t)).length;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Public service functions (API-first)                                */
/* ------------------------------------------------------------------ */

export async function getBooks(query: BookQuery = {}): Promise<PaginatedResult<Book>> {
  try {
    return await apiFetch<PaginatedResult<Book>>("/books", {
      params: {
        search: query.search,
        category: query.category === "all" ? undefined : query.category,
        language: query.language === "all" ? undefined : query.language,
        year: query.year === "all" ? undefined : query.year,
        sort: query.sort ?? "newest",
        page: query.page ?? 1,
        pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      },
    });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return mockGetBooks(query);
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    return await apiFetch<Book>(`/books/${slug}`);
  } catch (error) {
    if (!isUnreachable(error)) return null;
    await delay(300);
    return books.find((b) => b.slug === slug) ?? null;
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  try {
    return await apiFetch<Book[]>("/books/featured");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return books.filter((b) => b.featured);
  }
}

export async function getRelatedBooks(book: Book, limit = 4): Promise<Book[]> {
  try {
    return await apiFetch<Book[]>(`/books/${book.slug}/related`, { params: { limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return mockRelated(book, limit);
  }
}

export async function getBookYears(): Promise<number[]> {
  try {
    return await apiFetch<number[]>("/books/years");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return [...new Set(books.map((b) => b.publicationYear))].sort((a, b) => b - a);
  }
}

export async function searchBooksQuick(term: string, limit = 5): Promise<Book[]> {
  const q = term.trim();
  if (!q) return [];
  try {
    return await apiFetch<Book[]>("/books/quick-search", { params: { q, limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    const lower = q.toLowerCase();
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.tags.some((t) => t.toLowerCase().includes(lower))
      )
      .slice(0, limit);
  }
}
