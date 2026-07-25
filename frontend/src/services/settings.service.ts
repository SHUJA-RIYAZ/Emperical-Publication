import { defaultSettings } from "@/data/settings";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { SiteSettings } from "@/types";

const CACHE_TTL_MS = 60_000;

let cache: { value: SiteSettings; at: number } | null = null;
let inflight: Promise<SiteSettings> | null = null;

/**
 * Fetches admin-editable site settings. Cached briefly because several
 * components request it per page load; the short TTL means admin edits appear
 * without restarting the server. Falls back to the last good copy (or the
 * bundled defaults) so a settings outage never blanks the site chrome.
 */
export async function getSettings(): Promise<SiteSettings> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;
  if (inflight) return inflight;

  inflight = apiFetch<SiteSettings>("/settings", { timeoutMs: 6000 })
    .then((settings) => {
      cache = { value: settings, at: Date.now() };
      return settings;
    })
    .catch((error: unknown) => {
      void isUnreachable(error);
      return cache?.value ?? defaultSettings;
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
