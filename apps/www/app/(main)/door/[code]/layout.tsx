//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import type { CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import Navbar_Page from "./_@navbar/page";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: CodeParms }>) {
  const navbar = <Navbar_Page params={params} />;
  const session = await getServerSession();
  if (!session) {
    return notFound();
  }

  if (params.code === session.profile.id) {
    redirect("/@~");
  }
  const is_yours = params.code === "~";
  if (!is_yours)
    return (
      <AuthSessionProvider session={session}>
        <Grid className="my-10">
          <div
            className="
              col-span-full
              md:col-span-6
              md:col-start-2
              lg:col-span-5
              lg:col-start-3
              xl:col-span-6
              xl:col-start-4
            "
          >
            {children}
          </div>
        </Grid>
      </AuthSessionProvider>
    );

  return (
    <AuthSessionProvider session={session}>
      <Grid fluid>
        <aside className="hidden bg-white shadow-[20px_0px_40px_#00000014] md:col-span-2 md:block xl:col-span-3">
          {navbar}
        </aside>
        <div className="col-span-full md:col-span-6 xl:col-span-9">
          {children}
        </div>
      </Grid>
    </AuthSessionProvider>
  );
}
