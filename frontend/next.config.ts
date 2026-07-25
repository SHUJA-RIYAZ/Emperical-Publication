import type { NextConfig } from "next";

/**
 * The site is served from a sub-path on cPanel. `basePath` is applied
 * automatically to next/link and the router, but NOT to raw
 * `window.location` assignments — those must use withBasePath() from
 * src/lib/navigation.ts, which reads the value exposed here.
 */
const basePath = "/emperical-publication";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
