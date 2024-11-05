"use client";

import { trpc_client } from "@1.infra/trpc/react-query/client";
import { useQueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

export function TrpcRootProvider({ children }: PropsWithChildren) {
  const query_client = useQueryClient();
  const client = trpc_client.createClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          (process.env.NODE_ENV === "development" &&
            typeof window !== "undefined") ||
          (opts.direction === "down" && opts.result instanceof Error),
      }),

      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
    transformer: SuperJSON,
  });
  return (
    <trpc_client.Provider client={client} queryClient={query_client}>
      {children}
    </trpc_client.Provider>
  );
}
