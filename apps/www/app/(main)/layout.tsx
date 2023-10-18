//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { getServerSession } from "@1.modules/auth.next";
import type { PropsWithChildren } from "react";

//

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession();

  return (
    <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
  );
}
