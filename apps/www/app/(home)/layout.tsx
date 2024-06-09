//

import { MenuBurger } from ":components/burger";
import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { PropsWithChildren } from "react";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

//

export default function Site_Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <AppLargeTopBar />

      <div className="flex-grow">{children}</div>

      <AppFooter />
    </main>
  );
}

//
//
//

function AppLargeTopBar() {
  return (
    <BigBar>
      <MenuBurger />
      <Link href="/">
        <SerkelsLogo />
      </Link>
    </BigBar>
  );
}
