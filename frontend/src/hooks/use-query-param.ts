"use client";

import { useEffect, useState } from "react";

/**
 * Reads a query-string parameter without `useSearchParams()`.
 *
 * `useSearchParams()` suspends until the client router is ready, which can
 * leave an enclosing Suspense boundary stuck on its fallback. Reading
 * `location.search` in an effect is SSR-safe and always settles.
 *
 * Returns `undefined` on the server and the first client render, then `null`
 * (absent) or the parameter's value.
 */
export function useQueryParam(key: string): string | null | undefined {
  const [value, setValue] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get(key));
  }, [key]);

  return value;
}
