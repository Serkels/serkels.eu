//

import { VisuallyHidden } from ":components/helpers/VisuallyHidden";
import { AppFooter } from ":components/shell/AppFooter.server";
import { BigBar } from ":components/shell/BigBar";
import { Grid } from ":components/shell/Grid";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

//

const TocTocLogo = dynamic(() => import(":components/TocTocLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Toc-Toc</VisuallyHidden>;
  },
});

//

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
