"use client";

import { TrpcProvider } from ":trpc/client";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import debug from "debug";
import { SessionProvider } from "next-auth/react";
import { useState, type PropsWithChildren } from "react";
import Nest from "react-nest";

//

export const log = debug("~:app/layout.client.tsx");
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
