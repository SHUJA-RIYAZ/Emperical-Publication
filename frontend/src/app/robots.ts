import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/navigation";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the panel and personal pages out of search results.
      disallow: ["/admin", "/account", "/login", "/register", "/reset-password", "/forgot-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
