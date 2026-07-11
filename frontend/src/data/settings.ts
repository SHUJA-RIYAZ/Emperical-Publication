// Relative imports (not "@/…") so scripts/export-seed.ts can run this via tsx.
import {
  OFFICES,
  PUBLISHING_PROCESS,
  SITE,
  SOCIAL_LINKS,
  STATS,
  TRUSTED_BY,
} from "../constants";
import type { SiteSettings } from "../types";

/**
 * Default site settings — used as the instant first paint, as the offline
 * fallback, and (via scripts/export-seed.ts) as the database seed.
 * Once the admin edits settings, the database values take precedence.
 */
export const defaultSettings: SiteSettings = {
  site: { ...SITE },
  stats: STATS.map((s) => ({ ...s })),
  trustedBy: [...TRUSTED_BY],
  socials: { ...SOCIAL_LINKS },
  offices: OFFICES.map((o) => ({ ...o })),
  process: PUBLISHING_PROCESS.map((p) => ({ ...p })),
};
