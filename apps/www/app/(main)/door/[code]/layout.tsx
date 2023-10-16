//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { authOptions } from "@1.modules/auth.next/nextauth.config";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log(">>>> Seesion notFound ");
    return notFound();
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
