//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { getServerSession } from "@1.modules/auth.next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession();

  if (!session) {
    return notFound();
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
