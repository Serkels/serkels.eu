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


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "toc-toc-rj",
    project: "www",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
