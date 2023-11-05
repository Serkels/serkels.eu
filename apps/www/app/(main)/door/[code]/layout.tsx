//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import type { CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { to } from "await-to-js";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import Navbar_Page from "./_@navbar/page";
//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: CodeParms }>) {
  let session;

  [, session] = await to(getServerSession());
  if (!session) return notFound();

  if (params.code === session.profile.id) {
    redirect("/@~");
  }

  const is_yours = params.code === "~";

  return (
    <AuthSessionProvider session={session}>
      {match(is_yours)
        .with(false, () => <Public_Layout>{children}</Public_Layout>)
        .with(true, () => (
          <Private_Layout params={params}>{children}</Private_Layout>
        ))
        .exhaustive()}
    </AuthSessionProvider>
  );
}

async function Public_Layout({ children }: PropsWithChildren) {
  return (
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
  );
}

async function Private_Layout({
  children,
  params,
}: PropsWithChildren<{ params: CodeParms }>) {
  const navbar = <Navbar_Page params={params} />;
  return (
    <div className="grid md:grid-cols-[minmax(0,_200px),_1fr] xl:grid-cols-[minmax(0,_300px),_1fr]">
      <aside className="hidden bg-white shadow-[20px_0px_40px_#00000014] md:block ">
        {navbar}
      </aside>
      <div className="">{children}</div>
    </div>
  );
}
