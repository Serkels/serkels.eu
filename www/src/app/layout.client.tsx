"use client";

import { TrpcProvider } from ":trpc/client";
import { root_container } from "@1/core/di";
import {
  ContainerContext,
  create_container_provider,
} from "@1/core/ui/di.context.client";
import { TRPC_REACT, TRPC_React } from "@1/strapi-trpc-router/react";
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
import { fromClient } from "./api/v1";
import { API_TOKEN } from "./api/v1/OpenAPI.repository";

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
  return (
    <Nest>
      <AuthSessionProvider />
      <ReactQueryClientProvider />
      <TrpcProvider />
      <NextTsyringeProvider />
      {children}
    </Nest>
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
            staleTime: Infinity,
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

const AppContainer = create_container_provider(() => {
  return [
    { token: "foo", useValue: "bar" },
    {
      token: API_TOKEN,
      useValue: fromClient,
    },

    {
      token: TRPC_REACT,
      useFactory: TRPC_React,
    },
    // {
    //   token: TRPC_REACT,
    //   useFactory: (à),
    //   options: { lifecycle: Lifecycle.ContainerScoped },
    // },
  ];
});

export function NextTsyringeProvider({ children }: PropsWithChildren) {
  // log(`<NextTsyringeProvider> 🌱 ${root_container.id}`);
  // const foo = useInject("foo");
  // console.log({ foo });
  return (
    <ContainerContext.Provider value={root_container}>
      <AppContainer>{children}</AppContainer>
    </ContainerContext.Provider>
  );
}
