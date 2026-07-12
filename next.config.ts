import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // postgres.js / drizzle should stay on the Node server runtime
  serverExternalPackages: ["postgres"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
