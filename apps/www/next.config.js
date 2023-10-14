//

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: [],
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
