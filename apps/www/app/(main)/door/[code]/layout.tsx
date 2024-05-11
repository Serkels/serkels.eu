//

import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import type { CodeParms } from ":pipes/code";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import { to } from "await-to-js";
import { notFound, redirect } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";
import { createSlot } from "react-slotify";
import { match } from "ts-pattern";
//

export default async function Layout({
  children,
  params,
  navbar,
}: PropsWithChildren<{ params: CodeParms; navbar: ReactNode }>) {
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
          <Private_Layout params={params}>
            <Private_Layout.Navbar>{navbar}</Private_Layout.Navbar>
            {children}
          </Private_Layout>
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
}: PropsWithChildren<{ params: CodeParms }>) {
  return (
    <div className="grid md:grid-cols-[minmax(0,_200px),_1fr] xl:grid-cols-[minmax(0,_300px),_1fr]">
      <aside className="hidden bg-white shadow-[20px_0px_40px_#00000014] md:block ">
        <Private_Layout.Navbar.Renderer childs={children} />
      </aside>
      <div className="">{children}</div>
    </div>
  );
}
Private_Layout.Navbar = createSlot();
