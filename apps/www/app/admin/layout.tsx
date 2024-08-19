//

import { AppFooter } from ":components/shell/AppFooter.server";
import { AuthSessionProvider } from ":components/shell/AuthSessionProvider";
import { BigBar } from ":components/shell/BigBar";
import { TRPC_SSR } from ":trpc/server";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Admin :: ${(await parent).title?.absolute}`,
  };
}

export default async function Layout({ children }: PropsWithChildren) {
  const [, session] = await to(getServerSession());
  if (!session) notFound();
  const { user } = session;

  if (!user?.email) notFound();
  const profile = await TRPC_SSR.profile.by_email.fetch(user.email);

  if (profile.role !== PROFILE_ROLES.Enum.ADMIN) {
    notFound();
  }

  return (
    <AuthSessionProvider session={session}>
      <main className="flex min-h-screen flex-col bg-white">
        <BigBar>
          <Link href="/admin">
            <SerkelsLogo />
          </Link>
        </BigBar>

        <div className="container mx-auto flex-grow">{children}</div>

        <AppFooter />
      </main>
    </AuthSessionProvider>
  );
}
