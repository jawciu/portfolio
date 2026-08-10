import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Reverse-proxy PostHog under /ingest so ad-blockers (which filter by the
  // *.posthog.com host) don't drop analytics. Requests leave the browser as
  // same-origin /ingest/* and Next forwards them to the EU PostHog cloud.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/flags",
        destination: "https://eu.i.posthog.com/flags",
      },
    ];
  },
  async redirects() {
    return [
      // Stale URL from a previous life of the COG case study, still hit via old links
      {
        source: "/cog_clinic_research_and_strategy",
        destination: "/project/cog-adhd",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
