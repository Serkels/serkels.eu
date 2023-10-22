//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import type { CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: CodeParms }>) {
  const session = await getServerSession();

  if (!session) {
    return notFound();
  }

  if (params.code === session.profile.id) {
    return redirect("/@~");
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
