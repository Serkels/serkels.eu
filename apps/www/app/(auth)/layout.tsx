//

import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

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
