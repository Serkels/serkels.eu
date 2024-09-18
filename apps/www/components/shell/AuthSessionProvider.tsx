"use client";
import { sendGAEvent } from "@next/third-parties/google";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect, type PropsWithChildren } from "react";

export function AuthSessionProvider({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  useEffect(() => {
    const user_id = session?.profile.id;
    if (!user_id) return;
    sendGAEvent("set", { user_id });
  }, [session?.profile.id]);
  return <SessionProvider session={session}> {children} </SessionProvider>;
}
