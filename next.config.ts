import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["local.bryan-ricci.com"],
  transpilePackages: ['@vrobots/storybook'],
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@vrobots/storybook"],
  },
};

export default nextConfig;
