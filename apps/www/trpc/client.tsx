"use client";

import type { Router } from "@1.infra/trpc";
import { useQueryClient } from "@tanstack/react-query";
import {
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState, type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

export const TRPC_React = createTRPCReact<Router>({
  abortOnUnmount: true,
});

function useTRPCClient() {
  const { data: session } = useSession();
  const [trpc_client, set_trpc_client] =
    useState<ReturnType<typeof TRPC_React.createClient>>();

  useEffect(() => {
    const client = createWSClient({
      url: `${process.env["NEXT_PUBLIC_WEBSOCKET_URL"]}`,
    });

    const _trpc_client = TRPC_React.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client,
          }),
          false: httpBatchLink({
            url: "/api/trpc",
            headers: { ...session?.header },
          }),
        }),
      ],

      transformer: SuperJSON,
    });

    //

    set_trpc_client(_trpc_client);

    return () => {
      client.close();
    };
  }, []);

  return trpc_client;
}
export function TrpcProvider({ children }: PropsWithChildren) {
  // const session = useSession();

  const query_client = useQueryClient();
  const trpc_client = useTRPCClient();

  if (!trpc_client) return;

  return (
    <TRPC_React.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </TRPC_React.Provider>
  );
}
