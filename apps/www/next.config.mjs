//

import process from "node:process";
import { withSentryConfig } from "@sentry/nextjs";
import { z } from "zod";

//

/** @type {import('next').NextConfig} */
let config;

const ENV = z
  .object({
    API_URL: z.string().url(),
    MAINTENANCE: z.coerce.boolean().default(false),
    STALKER_URL: z.string().url(),
  })
  .parse(process.env);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: [],
  async redirects() {
    if (ENV.MAINTENANCE)
      return [
        // { source: "/", destination: "/maintenance", permanent: false },
        {
          source: `/:path((?!${[
            "_next",
            "favicon.ico$",
            "monitoring$",
            "stalker.js$",
            "api",
            "maintenance$",
            "toc-toc.svg$",
          ].join("|")}).*)`,
          destination: "/maintenance",
          permanent: false,
        },
      ];
    return [
      {
        permanent: true,
        source: "/api/auth/magic/email/:identifier/:token/:path*",
        destination: "/api/auth/callback/email?email=:identifier&token=:token",
      },
    ];
  },
  async rewrites() {
    if (ENV.MAINTENANCE) return [{ source: "/", destination: "/maintenance" }];
    return [
      {
        source: "/api/trpc/:path*",
        destination: `${process.env["API_URL"]}/trpc/:path*`,
      },

      //

      {
        source: "/@:code/:path*",
        destination: `/door/:code/:path*`,
      },

      //

      {
        source: "/stalker.js",
        destination: `https://www.googletagmanager.com/gtag/js`,
      },
      {
        source: "/api/stalker/:path*",
        destination: `${process.env["STALKER_URL"]}/:path*`,
      },
    ];
  },
};

config = nextConfig;

// Injected content via Sentry wizard below

config = withSentryConfig(
  config,
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
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);

export default config;
