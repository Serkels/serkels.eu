//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { authOptions } from "@1.modules/auth.next/nextauth.config";
import { getServerSession } from "next-auth";
import { Client_Page } from "./page.client";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <>{JSON.stringify(session?.user, null, 2)}</>;
      <hr />
      <AuthSessionProvider session={session}>
        <Client_Page />
      </AuthSessionProvider>
    </main>
  );
}
