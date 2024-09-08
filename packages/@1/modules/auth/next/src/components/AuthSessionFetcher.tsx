"use client";

import { startSpan } from "@sentry/core";
import type { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

//

export function AuthSessionFetcher({
  children,
  session: initialState = null,
}: PropsWithChildren<{ session: Session | null }>) {
  const [session, setSession] = useState<Session | null>(initialState);
  const fetchSession = useCallback(async () => {
    const session = await startSpan(
      { name: "AuthSessionFetcher#fetchSession", op: "@1.modules/auth.next" },
      () => getSession(),
    );
    setSession(session);
  }, [initialState]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
