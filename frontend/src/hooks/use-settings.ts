"use client";

import { useEffect, useState } from "react";
import { defaultSettings } from "@/data/settings";
import { getSettings } from "@/services/settings.service";
import type { SiteSettings } from "@/types";

/**
 * Site settings for client components. Renders the bundled defaults
 * immediately, then swaps in the admin-edited values from the API.
 */
export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((s) => {
      if (!cancelled) setSettings(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
