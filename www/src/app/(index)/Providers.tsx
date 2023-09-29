"use client";

import { setUser } from "@sentry/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import debug from "debug";
import { SessionProvider, useSession } from "next-auth/react";
import { event, usePageViews } from "nextjs-google-analytics";
import { useEffect, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { query_client } from "~/core/getQueryClient";

//

if (process.env["NEXT_PUBLIC_DEBUG"]) {
  debug.enable(process.env["NEXT_PUBLIC_DEBUG"] ?? "*");
}

//

export const initial_context = {
  repositories: new WeakMap(),
} as const;

export default function Providers({ children }: PropsWithChildren) {
  usePageViews({
    gaMeasurementId: process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"],
    ignoreHashChange: false,
  });

  return (
    <>
      <QueryClientProvider client={query_client}>
        <SessionProvider>
          <UserTracking />
          {children}
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
