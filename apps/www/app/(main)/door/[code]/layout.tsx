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
  if (1) return <>{children}</>;
  const session = await getServerSession();

  console.log(
    "/home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/layout.tsx",
    {
      session,
    },
  );
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
