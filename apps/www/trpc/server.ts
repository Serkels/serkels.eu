//

import type { Router } from "@1.infra/trpc";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

//

const proxyClient = createTRPCProxyClient<Router>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: `${process.env["API_URL"]}`,
    }),
  ],
  transformer: SuperJSON,
});

export const TRPC_SSR = createServerSideHelpers({
  client: proxyClient,
});
