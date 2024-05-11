//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { getServerSession } from "@1.modules/auth.next";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  const session = await getServerSession();

  if (!session) {
    notFound();
  }

  const is_your_door_code =
    params.code === "~" || session.profile?.id === params.code;

  if (!is_your_door_code) {
    redirect(`/@${params.code}`);
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
