"use client";

import { TRPC_React } from ":trpc/client";
import type { Session } from "next-auth";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";

//

export function Client_Page() {
  const session = useSession();

  const magic = TRPC_React.auth.passwordless.magic.useMutation();

  //

  return (
    <main>
      <h1>Client_Page</h1>
      <br />
      <code>{JSON.stringify(session?.status, null, 2)}</code>;
      <br />
      <code>{JSON.stringify(session?.data, null, 2)}</code>;
      <br />
      <button onClick={() => signOut()}>Logout</button>
      <br />
      <button
        onClick={() =>
          magic.mutate({ email: "alejandrin.howe81@ethereal.email" })
        }
      >
        Connect as alejandrin.howe81@ethereal.email
      </button>
    </main>
  );
}

export function AuthSessionProvider({
  children,
  session,
}: PropsWithChildren<{ session: Session | null }>) {
  return <SessionProvider session={session}> {children} </SessionProvider>;
}
