//

import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import SerkelsLogo from ":components/shell/SerkelsLogo";
import type { PropsWithChildren } from "react";

//

export default function Layout({ children }: PropsWithChildren) {
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
