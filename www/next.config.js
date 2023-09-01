//

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: [
    "@1/core",
    "@1/modules",
    "@1/tailwindcss-config",
    "@1/ui",
  ],
  async redirects() {
    return [
      {
        source: "/@:code/bookmarks",
        destination: "/@:code/bookmarks/opportunities",
        permanent: true,
      },
      {
        source: "/@:code/exchanges/:id",
        destination: "/@:code/exchanges/:id/deals",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/@:code/:path*",
        destination: `/door/:code/:path*`,
      },
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

//

// Injected
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(module.exports);

//

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
  },
);
