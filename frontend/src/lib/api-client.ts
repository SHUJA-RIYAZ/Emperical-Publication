/**
 * Thin HTTP client for the FastAPI backend.
 *
 * The production API URL is the built-in default, so a build with no env file
 * still points at the live server. Local development overrides it through
 * `.env.development` (NEXT_PUBLIC_* values are inlined at build time).
 */

const PRODUCTION_API_URL = "https://irmms.org/emperical-api/api";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL).replace(
  /\/+$/,
  ""
);

/** Mock data may only stand in for the API during local development. */
export const ALLOW_MOCK_FALLBACK = process.env.NODE_ENV !== "production";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  timeoutMs?: number;
  /** Send as-is (FormData) instead of JSON-encoding. */
  rawBody?: BodyInit;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { params, body, rawBody, timeoutMs = 15000, headers, ...init } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      // Let the browser set the multipart boundary when sending FormData.
      headers: rawBody ? { ...headers } : { "Content-Type": "application/json", ...headers },
      body: rawBody ?? (body !== undefined ? JSON.stringify(body) : undefined),
      cache: "no-store",
    });

    if (!response.ok) {
      let detail = response.statusText;
      try {
        const data = (await response.json()) as { detail?: unknown };
        if (typeof data.detail === "string") {
          detail = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI validation errors
          const first = data.detail[0] as { msg?: string } | undefined;
          if (first?.msg) detail = first.msg.replace(/^Value error,\s*/, "");
        }
      } catch {
        // non-JSON error body
      }
      throw new ApiError(response.status, detail);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * True when a request failed because the API itself is unreachable or broken,
 * and (in development only) mock data may be substituted. In production this
 * always returns false so outages surface as real error states instead of
 * silently serving stale bundled content.
 */
export function isUnreachable(error: unknown): boolean {
  if (!ALLOW_MOCK_FALLBACK) return false;
  if (error instanceof ApiError) return error.status >= 500;
  return true; // fetch/abort/network errors
}
