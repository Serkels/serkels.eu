///

import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid $padding={false}>{children}</Grid>
      <AppFooter />
    </div>
  );
}
