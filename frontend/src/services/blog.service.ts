import { blogs } from "@/data/blogs";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { BlogPost, BlogQuery } from "@/types";
import { delay } from "./api";

function mockFiltered(query: BlogQuery): BlogPost[] {
  const { search, category, tag } = query;
  let result = [...blogs];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }
  if (category && category !== "all") result = result.filter((p) => p.category === category);
  if (tag && tag !== "all") result = result.filter((p) => p.tags.includes(tag));
  return result.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogs(query: BlogQuery = {}): Promise<BlogPost[]> {
  try {
    return await apiFetch<BlogPost[]>("/blogs", {
      params: {
        search: query.search,
        category: query.category === "all" ? undefined : query.category,
        tag: query.tag === "all" ? undefined : query.tag,
      },
    });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return mockFiltered(query);
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await apiFetch<BlogPost>(`/blogs/${slug}`);
  } catch (error) {
    if (!isUnreachable(error)) return null;
    await delay(300);
    return blogs.find((p) => p.slug === slug) ?? null;
  }
}

export async function getLatestBlogs(limit = 3): Promise<BlogPost[]> {
  try {
    return await apiFetch<BlogPost[]>("/blogs", { params: { limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    await delay(300);
    return [...blogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
  }
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  try {
    return await apiFetch<BlogPost[]>(`/blogs/${post.slug}/related`, { params: { limit } });
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return blogs
      .filter((p) => p.id !== post.id)
      .sort((a, b) => {
        const score = (x: BlogPost) =>
          (x.category === post.category ? 2 : 0) +
          x.tags.filter((t) => post.tags.includes(t)).length;
        return score(b) - score(a);
      })
      .slice(0, limit);
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    return await apiFetch<string[]>("/blogs/categories");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return [...new Set(blogs.map((p) => p.category))].sort();
  }
}

export async function getBlogTags(): Promise<string[]> {
  try {
    return await apiFetch<string[]>("/blogs/tags");
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return [...new Set(blogs.flatMap((p) => p.tags))].sort();
  }
}
