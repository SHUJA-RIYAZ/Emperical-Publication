import { defaultSettings } from "@/data/settings";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { SiteSettings } from "@/types";

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

/**
 * Fetches admin-editable site settings. Cached per page load (several
 * components consume it), with the bundled defaults as offline fallback.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = apiFetch<SiteSettings>("/settings", { timeoutMs: 5000 })
    .then((settings) => {
      cache = settings;
      return settings;
    })
    .catch((error: unknown) => {
      if (!isUnreachable(error)) throw error;
      return defaultSettings;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Clears the cache (used by the admin panel after saving). */
export function invalidateSettings(): void {
  cache = null;
}
