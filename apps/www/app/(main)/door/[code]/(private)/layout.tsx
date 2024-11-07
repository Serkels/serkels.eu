//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { getServerSession } from "@1.modules/auth.next";
import to from "await-to-js";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ code: string }> }>,
) {
  const params = await props.params;

  const { children } = props;

  const [, session] = await to(getServerSession());
  if (!session) return null;

  const is_your_door_code =
    params.code === "~" || session.profile?.id === params.code;

  if (!is_your_door_code) {
    redirect(`/@${params.code}`);
  }

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
