import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/navigation";
import { getAuthors } from "@/services/authors.service";
import { getBlogs } from "@/services/blog.service";
import { getBooks } from "@/services/books.service";

/** Regenerate at most hourly so new admin content gets indexed without a rebuild. */
export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/books",
  "/authors",
  "/journals",
  "/publish",
  "/blog",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // A sitemap must never break the build if the API is briefly unavailable.
  const [books, authors, posts] = await Promise.all([
    getBooks({ pageSize: 500 })
      .then((r) => r.items)
      .catch(() => []),
    getAuthors().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  return [
    ...staticEntries,
    ...books.map((b) => ({
      url: `${SITE_URL}/books/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...authors.map((a) => ({
      url: `${SITE_URL}/authors/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
