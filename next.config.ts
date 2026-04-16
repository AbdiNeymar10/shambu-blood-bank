import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure ESM packages like framer-motion are transpiled for Next's bundler
  transpilePackages: ["framer-motion"],
};

export default nextConfig;
