///

import { Grid } from "@1/ui/components/Grid";
import { BigBar } from "@1/ui/shell";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <BigBar>
        <Image
          src="/toc-toc.svg"
          alt="Toc Toc Logo"
          width={175}
          height={53}
          priority
        />
      </BigBar>
      <Grid $padding={false}>{children}</Grid>
      <AppFooter />
    </div>
  );
}
