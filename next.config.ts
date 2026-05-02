import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure ESM packages like framer-motion are transpiled for Next's bundler
  transpilePackages: ["framer-motion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
