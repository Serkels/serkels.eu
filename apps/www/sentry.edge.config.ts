// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  debug: process.env.NODE_ENV === "development",
  dsn: "https://a959c5a3e386404aa6d779733a1143d3@o4505068763348992.ingest.us.sentry.io/4505068786483200",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 1,
});
