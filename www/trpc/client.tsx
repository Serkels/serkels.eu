"use client";

import { TRPC_React } from "@1/strapi-trpc-router/react";
import { useQueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { useSession } from "next-auth/react";
import { useMemo, type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

export function TrpcProvider({ children }: PropsWithChildren) {
  const session = useSession();

  const query_client = useQueryClient();

  const trpc_client = useMemo(
    () =>
      TRPC_React.createClient({
        transformer: SuperJSON,
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
      }),
    [session.status],
  );

  return (
    <TRPC_React.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </TRPC_React.Provider>
  );
}
