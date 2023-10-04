///

import { AppFooter } from ":components/AppFooter.server";
import { Grid } from "@1/ui/components/Grid";
import { VisuallyHidden } from "@1/ui/helpers/VisuallyHidden";
import { BigBar } from "@1/ui/shell";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

//

const TocTocLogo = dynamic(() => import(":components/TocTocLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Toc-Toc</VisuallyHidden>;
  },
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <BigBar>
        <TocTocLogo />
      </BigBar>
      <Grid fluid>{children}</Grid>
      <AppFooter />
    </div>
  );
}
