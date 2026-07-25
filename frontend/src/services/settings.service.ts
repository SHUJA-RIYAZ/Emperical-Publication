import { defaultSettings } from "@/data/settings";
import { apiFetch, isUnreachable } from "@/lib/api-client";
import type { SiteSettings } from "@/types";

const CACHE_TTL_MS = 60_000;

let cache: { value: SiteSettings; at: number } | null = null;
let inflight: Promise<SiteSettings> | null = null;

/**
 * Ensures a settings object has all properties set, falling back to defaults if missing.
 */
export function ensureDefaults(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!data) return defaultSettings;
  return {
    site: data.site ? { ...defaultSettings.site, ...data.site } : defaultSettings.site,
    stats: data.stats ?? defaultSettings.stats,
    trustedBy: data.trustedBy ?? defaultSettings.trustedBy,
    socials: data.socials ? { ...defaultSettings.socials, ...data.socials } : defaultSettings.socials,
    offices: data.offices ?? defaultSettings.offices,
    process: data.process ?? defaultSettings.process,
    values: data.values ?? defaultSettings.values,
    reasons: data.reasons ?? defaultSettings.reasons,
    milestones: data.milestones ?? defaultSettings.milestones,
    leadership: data.leadership ?? defaultSettings.leadership,
    departments: data.departments ?? defaultSettings.departments,
  };
}

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
      const sanitized = ensureDefaults(settings);
      cache = { value: sanitized, at: Date.now() };
      return sanitized;
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

