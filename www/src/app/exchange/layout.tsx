///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { AsideWithTitle } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { Suspense, type PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <AsideWithTitle title="Échanges">
          <Suspense fallback={null}>{/* <InputSearch /> */}</Suspense>
          {/* <ExhangesFilter /> */}
        </AsideWithTitle>
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}
