//

import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import process from "node:process";
import { z } from "zod";

//

/** @type {import('next').NextConfig} */
let config;

const ENV = z
  .object({
    API_URL: z.string().url().default("http://localhost:8080"),
    MAINTENANCE: z.coerce.boolean().default(false),
    STALKER_URL: z
      .string()
      .url()
      .default("https://www.googletagmanager.com/gtag/js"),
    STALKER_TRANSPORT_URL: z
      .string()
      .url()
      .default("https://region1.google-analytics.com"),
  })
  .parse(process.env);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xliajqivstyuw7e1.public.blob.vercel-storage.com",
        port: "",
      },
    ],
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
            "opengraph-image.png$",
            "favicon.ico$",
            "monitoring$",
            "stalker.js$",
            "api",
            "maintenance$",
            "serkels-noir.svg$",
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

      {
        source: "/@~/bookmarks",
        destination: "/@~/bookmarks/opportunities",
        permanent: true,
      },
      {
        source: "/signup/partner",
        destination: "/not-found",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    if (ENV.MAINTENANCE) return [{ source: "/", destination: "/maintenance" }];
    return [
      {
        source: "/api/health",
        destination: `${ENV.API_URL}/health`,
      },

      {
        source: "/api/$/trpc/:path*",
        destination: `${ENV.API_URL}/trpc/:path*`,
      },

      //

      {
        source: "/@:code/:path*",
        destination: `/door/:code/:path*`,
      },

      //

      {
        source: "/stalker.js",
        destination: `${ENV.STALKER_URL}`,
      },
      {
        source: "/api/stalker/:path*",
        destination: `${ENV.STALKER_TRANSPORT_URL}/:path*`,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

config = nextConfig;

// Injected content via Sentry wizard below

export default withSentryConfig(config, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  automaticVercelMonitors: true,
  disableLogger: true,
  hideSourceMaps: false,
  org: "toc-toc-rj",
  project: "www",
  silent: !!process.env.CI,
  telemetry: false,
  transpileClientSDK: false,
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
});
