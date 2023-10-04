"use client";

import type { AppRouter } from ":api/trpc/[trpc]/route";
import { useQueryClient } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import { log } from "app/layout.client";
import { useSession } from "next-auth/react";
import { useMemo, type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

export const trpc = createTRPCReact<AppRouter>({
  abortOnUnmount: true,
});

export function TrpcProvider({ children }: PropsWithChildren) {
  log("TrpcProvider");

  const session = useSession();

  log("<TrpcProvider> session=", session);
  const query_client = useQueryClient();

  const trpc_client = useMemo(
    () => trpc.createClient({
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (opts) => (process.env.NODE_ENV === "development" &&
            typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
    [session.status]
  );

  return (
    <trpc.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </trpc.Provider>
  );
}

