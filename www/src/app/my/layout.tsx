///

import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
// import { AsideNav } from "./AsideNav";
import { Layout_Grid, Layout_Provider } from "./layout.client";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Layout_Provider initialValue={{ fixed_frame: false }}>
      <Layout_Grid>
        {/* <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]"> */}
        <UserBar />
        <Grid $padding={false} className="overflow-y-auto">
          {/* <AsideNav className="z-40 shadow-[20px_0px_40px_#00000014]" /> */}
          {children}
        </Grid>
        <AppFooter />
        {/* </div> */}
      </Layout_Grid>
    </Layout_Provider>
  );
}
