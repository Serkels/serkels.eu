//

"use client";

import type { AppRouter } from "@1/strapi-trpc-router";
import { experimental_createTRPCNextAppDirClient } from "@trpc/next/app-dir/client";
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp";
import { createWSClient, loggerLink, wsLink } from "@trpc/react-query";
import SuperJSON from "superjson";

export const trpc = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),

        ...(typeof window === "undefined"
          ? [
              experimental_nextHttpLink({
                url: `/api/v1`,
              }),
            ]
          : [
              wsLink({
                client: createWSClient({
                  url: `${process.env["NEXT_PUBLIC_WEBSOCKET_URL"]}`,
                }),
              }),
            ]),
      ],
      transformer: SuperJSON,
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
});
