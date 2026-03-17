import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["local.bryan-ricci.com"],
  transpilePackages: ['@vrobots/storybook', "@chakra-ui/react"],
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@vrobots/storybook", "react-hook-form", "axios", "react-icons", "@emotion/react", "@emotion/styled", "motion"],
  },
};

export default nextConfig;
