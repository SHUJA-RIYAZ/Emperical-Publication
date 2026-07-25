/** Base path the app is served from (empty in local dev). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes an app-relative path with the deployment basePath.
 *
 * `next/link` and `router.push()` handle basePath automatically — use this only
 * for full-page navigations via `window.location`, which do not.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** Absolute site origin + basePath, used for canonical URLs and sitemaps. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || `https://irmms.org${BASE_PATH}`
).replace(/\/+$/, "");
