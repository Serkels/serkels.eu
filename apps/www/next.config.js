//

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: [],
  async redirects() {
    return [
      {
        permanent: true,
        source: "/api/auth/magic/email/:identifier/:token/:path*",
        destination: "/api/auth/callback/email?email=:identifier&token=:token",
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*",
        destination: `${process.env["API_URL"]}/:path*`,
      },

      //

      {
        source: "/@:code/:path*",
        destination: `/door/:code/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
