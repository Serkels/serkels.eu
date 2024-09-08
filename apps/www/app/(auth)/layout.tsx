//

import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import { auth } from "@1.modules/auth.next/auth";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

//

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (session?.profile.id) redirect("/");
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <BigBar>
        <SerkelsLogo />
      </BigBar>
      {children}
      <AppFooter />
    </div>
  );
}
