"use client";
import type { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

export function AuthSessionProvider({ children }: PropsWithChildren) {
  console.log("!!!!!!!!!!!");
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = useCallback(async () => {
    const session = await getSession();
    setSession(session);
  }, [getSession]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
