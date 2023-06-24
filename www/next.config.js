/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@1/ui", "@1/tailwindcss-config"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env["STRAPI_API_URL"]}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
