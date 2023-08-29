///

import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { AsideNav } from "./AsideNav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid
        $padding={false}
        // className="xl:grid-cols-[max-content,_minmax(0,_max-content)]"
      >
        <AsideNav className="z-40 shadow-[20px_0px_40px_#00000014]" />
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}
