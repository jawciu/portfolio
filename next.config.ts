import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
