"use client";

import { trpc } from ":trpc/index";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import debug from "debug";
import { SessionProvider } from "next-auth/react";
import { useState, type PropsWithChildren } from "react";
import SuperJSON from "superjson";

//

if (process.env["NEXT_PUBLIC_DEBUG"]) {
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
  const [trpc_client] = useState(() =>
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
          // You can pass any HTTP headers you wish here
          // async headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
    }),
  );

  return (
    <AuthSessionProvider>
      <trpc.Provider client={trpc_client} queryClient={query_client}>
        <QueryClientProvider client={query_client}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </AuthSessionProvider>
  );
}

function AuthSessionProvider({ children }: PropsWithChildren) {
  return <SessionProvider> {children} </SessionProvider>;
}
