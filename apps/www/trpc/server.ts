//

import type { Router } from "@1.infra/trpc";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

//

const proxyClient = createTRPCProxyClient<Router>({
  links: [
    httpLink({
      url: `${process.env["API_URL"]}`,
    }),
  ],
  transformer: SuperJSON,
});

export const TRPC_SSR = createServerSideHelpers({
  client: proxyClient,
});
