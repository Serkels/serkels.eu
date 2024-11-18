"use client";

import { LegalProvider } from ":components/terms/context";
import { TrpcProvider } from ":trpc/client";
import { SessionProvider } from "@1.modules/auth.next/react";
import { useMediaQuery } from "@react-hookz/web";
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import debug from "debug";
import { useState, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

//

export function RootProviders({ children }: PropsWithChildren) {
  const isMd = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <ToastContainer
        className="min-w-[25%] text-center"
        position={isMd ? "bottom-left" : "top-center"}
      />
      <LegalProvider>
        <AuthSessionProvider>
          <ReactQueryClientProvider>
            <TrpcProvider>{children}</TrpcProvider>
          </ReactQueryClientProvider>
        </AuthSessionProvider>
      </LegalProvider>
    </>
  );
}

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
