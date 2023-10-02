"use client";

import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
//

import { SessionProvider } from "next-auth/react";
import { useRef, type PropsWithChildren } from "react";
import Nest from "react-nest";

//

const options: DefaultOptions = {
  // from https://openapi-ts.pages.dev/openapi-fetch/examples/#further-optimization
  queries: {
    networkMode: "offlineFirst", // keep caches as long as possible
    refetchOnWindowFocus: false, // don’t refetch on window focus
  },
};

export function RootProviders({ children }: PropsWithChildren) {
  const client = useRef(
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
    <Nest>
      <AuthSessionProvider />
      <QueryClientProvider client={client.current} />
      {children}
    </Nest>
  );
}

function AuthSessionProvider({ children }: PropsWithChildren) {
  return <SessionProvider> {children} </SessionProvider>;
}
