//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { getServerSession } from "@1.modules/auth.next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  const session = await getServerSession();

  if (!session) {
    return notFound();
  }

  const is_your_door_code =
    params.code === "~" || session.user?.id === params.code;

  if (!is_your_door_code) {
    return notFound();
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
