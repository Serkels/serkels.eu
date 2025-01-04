"use client";

import type { Session } from "@1.modules/auth.next";
import { SessionProvider } from "@1.modules/auth.next/react";
import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, type PropsWithChildren } from "react";

//

export function AuthSessionProvider({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  useEffect(() => {
    const user_id = session?.profile?.id;
    if (!user_id) return;
    sendGAEvent("set", { user_id });
  }, [session?.profile?.id]);
  return <SessionProvider session={session}> {children} </SessionProvider>;
}
