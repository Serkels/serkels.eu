"use client";

import type { Router } from "@1.infra/trpc";
import { useSession } from "@1.modules/auth.next/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createTRPCReact,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
  type inferReactQueryProcedureOptions,
  type TRPCWebSocketClient,
} from "@trpc/react-query";
import { useEffect, useState, type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

export type ReactQueryProcedureOptions =
  inferReactQueryProcedureOptions<Router>;

export const TRPC_React = createTRPCReact<Router>({
  abortOnUnmount: true,
});

//

function trpc_config({
  ws_client,
  session_header,
}: {
  ws_client: TRPCWebSocketClient | undefined;
  session_header: Record<string, string>;
}) {
  const links = [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
  ];

  if (ws_client) {
    links.push(
      splitLink({
        condition(op) {
          return op.type === "subscription";
        },
        true: wsLink({
          client: ws_client,
        }),
        false: httpBatchLink({
          url: "/api/$/trpc",
          headers: () => {
            return { ...session_header };
          },
        }),
      }),
    );
  } else {
    links.push(
      httpBatchLink({
        url: "/api/$/trpc",
        headers: () => {
          return { ...session_header };
        },
      }),
    );
  }

  return TRPC_React.createClient({
    links,
    transformer: SuperJSON,
  });
}

//

function useTrpcWsClient() {
  const [ws_client, set_ws_client] = useState<TRPCWebSocketClient>();

  useEffect(() => {
    const client = createWSClient({
      url: `${process.env["NEXT_PUBLIC_WEBSOCKET_URL"]}`,
    });
    set_ws_client(client);
    return client.close;
  }, []);

  return ws_client;
}

function useTrpcClient() {
  const { data: session, status } = useSession();
  const ws_client = useTrpcWsClient();
  const [trpc_client, set_trpc_client] = useState(() =>
    trpc_config({ ws_client, session_header: session?.header ?? {} }),
  );
  useEffect(() => {
    set_trpc_client(
      trpc_config({ ws_client, session_header: session?.header ?? {} }),
    );
  }, [status]);
  return trpc_client;
}

//

export function TrpcProvider({ children }: PropsWithChildren) {
  const query_client = useQueryClient();
  const trpc_client = useTrpcClient();

  return (
    <TRPC_React.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </TRPC_React.Provider>
  );
}
