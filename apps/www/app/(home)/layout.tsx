//

import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import SerkelsLogo from ":components/shell/SerkelsLogo";
import Link from "next/link";
import type { PropsWithChildren } from "react";

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
      <Link href="/">
        <SerkelsLogo />
      </Link>
      {/* <MenuBurger className="md:right-9 md:top-6" /> */}
    </BigBar>
  );
}
