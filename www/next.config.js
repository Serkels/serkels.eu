/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@1/ui", "@1/tailwindcss-config"],
  async redirects() {
    return [
      {
        source: "/my",
        destination: "/my/profile/about",
        permanent: true,
      },
      {
        source: "/my/profile",
        destination: "/my/profile/about",
        permanent: true,
      },
      {
        source: "/my/bookmarks",
        destination: "/my/bookmarks/opportunities",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env["STRAPI_API_URL"]}/api/:path*`,
      },
      {
        source: "/wss",
        destination: `${process.env["STRAPI_API_URL"]}`,
      },
    ];
  },
};

module.exports = nextConfig;
