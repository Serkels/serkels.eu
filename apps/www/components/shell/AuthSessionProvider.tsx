"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function AuthSessionProvider({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  return <SessionProvider session={session}> {children} </SessionProvider>;
}
