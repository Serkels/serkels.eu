"use client";

import { TrpcProvider } from ":trpc/client";
import { useMediaQuery } from "@react-hookz/web";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import debug from "debug";
import { SessionProvider } from "next-auth/react";
import { useState, type PropsWithChildren } from "react";
import Nest from "react-nest";
import { ToastContainer } from "react-toastify";

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
  const isMd = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <ToastContainer
        className="min-w-[25%] text-center"
        position={isMd ? "bottom-left" : "top-center"}
      />
      <Nest>
        <AuthSessionProvider />
        <ReactQueryClientProvider />
        <TrpcProvider />
        {children}
      </Nest>
    </>
  );
}

function ReactQueryClientProvider({ children }: PropsWithChildren) {
  const [query_client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          ...options,
          queries: {
            ...options.queries,
            staleTime: 1_000 * 60, // 1 minute
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={query_client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

function AuthSessionProvider({ children }: PropsWithChildren) {
  return <SessionProvider> {children} </SessionProvider>;
}
