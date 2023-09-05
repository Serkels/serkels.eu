"use client";

import { setUser } from "@sentry/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import debug from "debug";
import { SessionProvider, useSession } from "next-auth/react";
import { event, usePageViews } from "nextjs-google-analytics";
import { useEffect, useMemo, type PropsWithChildren } from "react";
import Nest from "react-nest";
import { P, match } from "ts-pattern";
import { CoreProvider } from "~/core/react";
import { Question_Repository } from "~/modules/question/repository";
import { QuestionControllerProvider } from "~/modules/question/view/react";
import { fromClient } from "../api/v1";

//

if (process.env["NEXT_PUBLIC_DEBUG"]) {
  debug.enable(process.env["NEXT_PUBLIC_DEBUG"] ?? "*");
}

//

export const initial_context = {
  repositories: new WeakMap(),
} as const;

const queryClient = new QueryClient({
  defaultOptions: {
    // from https://openapi-ts.pages.dev/openapi-fetch/examples/#further-optimization
    queries: {
      networkMode: "offlineFirst", // keep caches as long as possible
      refetchOnWindowFocus: false, // don’t refetch on window focus
    },
  },
});

export default function Providers({ children }: PropsWithChildren) {
  usePageViews({
    gaMeasurementId: process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"],
    ignoreHashChange: false,
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <UserTracking />
          <ViewProvider>{children}</ViewProvider>
        </SessionProvider>

        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

function UserTracking() {
  const session = useSession();

  useEffect(() => {
    match(session)
      .with({ status: "authenticated", data: P.select() }, ({ user }) => {
        setUser({
          email: user?.email ?? undefined,
          id: user?.id ?? undefined,
        });
        event("authenticated", { userId: String(user?.id) });
        gtag("set", "userId", String(user?.profile.id));
      })
      .with({ status: "loading" }, () => {})
      .with({ status: "unauthenticated" }, () => {
        setUser(null);
        event("unauthenticated", { userId: undefined });
        gtag("set", "userId", "");
      })
      .exhaustive();
  }, [session]);

  return null;
}

function ViewProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession();
  const context = initial_context;

  context.repositories.set(
    Question_Repository,
    useMemo(
      () => new Question_Repository(fromClient, session?.user?.jwt),
      [session?.user?.jwt],
    ),
  );

  return (
    <CoreProvider value={context}>
      <Nest>
        <QuestionControllerProvider />
        {children}
      </Nest>
    </CoreProvider>
  );
}
