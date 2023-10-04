"use client";

import { trpc } from ":trpc/index";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  type DefaultOptions,
} from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import debug from "debug";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState, type PropsWithChildren } from "react";
import Nest from "react-nest";
import SuperJSON from "superjson";

//

const log = debug("~:app/layout.client.tsx");
//

if (
  process.env.NODE_ENV === "development" &&
  process.env["NEXT_PUBLIC_DEBUG"]
) {
  debug.enable(process.env["NEXT_PUBLIC_DEBUG"] ?? "*");
}

const options: DefaultOptions = {
  // from https://openapi-ts.pages.dev/openapi-fetch/examples/#further-optimization
  queries: {
    networkMode: "offlineFirst", // keep caches as long as possible
    refetchOnWindowFocus: false, // don’t refetch on window focus
  },
};

export function RootProviders({ children }: PropsWithChildren) {
  log("RootProviders");
  return (
    <Nest>
      <AuthSessionProvider />
      <ReactQueryClientProvider />
      <TrpcProvider />
      {children}
    </Nest>
  );
}

function TrpcProvider({ children }: PropsWithChildren) {
  log("TrpcProvider");

  const session = useSession();

  log("<TrpcProvider> session=", session);
  const query_client = useQueryClient();

  const trpc_client = useMemo(
    () =>
      trpc.createClient({
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

            // async headers() {
            //   await loaded_session;
            //   const authorization =
            //     session.status === "authenticated"
            //       ? {
            //           authorization: session.data.user?.jwt,
            //         }
            //       : {};
            //   log("<TrpcProvider> authorization=", authorization);
            //   log(
            //     "<TrpcProvider.httpBatchLink.headers> authorization=",
            //     authorization,
            //   );
            //   return {
            //     ...authorization,
            //   };
            // },
          }),
        ],
      }),
    [session.status],
  );

  return (
    <trpc.Provider client={trpc_client} queryClient={query_client}>
      {children}
    </trpc.Provider>
  );
}
function ReactQueryClientProvider({ children }: PropsWithChildren) {
  log("ReactQueryClientProvider");
  const [query_client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          ...options,
          queries: {
            ...options.queries,
            staleTime: Infinity,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={query_client}>{children}</QueryClientProvider>
  );
}

function AuthSessionProvider({ children }: PropsWithChildren) {
  log("AuthSessionProvider");
  return <SessionProvider> {children} </SessionProvider>;
}
