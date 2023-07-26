///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { AsideNav } from "./AsideNav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid theme-padding={false}>
        <AsideNav />
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}
