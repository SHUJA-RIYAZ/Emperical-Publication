import type { MetadataRoute } from "next";
import { authors } from "@/data/authors";
import { blogs } from "@/data/blogs";
import { books } from "@/data/books";

const BASE_URL = "https://www.empericalpublication.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/books",
    "/authors",
    "/journals",
    "/publish",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...books.map((b) => ({
      url: `${BASE_URL}/books/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...authors.map((a) => ({
      url: `${BASE_URL}/authors/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...blogs.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
