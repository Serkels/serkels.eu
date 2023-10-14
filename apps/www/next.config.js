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
    return [
      {
        source: "/api/trpc/:path*",
        destination: `${process.env["API_URL"]}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
