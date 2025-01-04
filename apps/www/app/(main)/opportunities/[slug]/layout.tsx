//

import { TrpcRootProvider } from ":trpc/root";
import { Grid } from "@1.ui/react/grid";
import { type PropsWithChildren } from "react";

//

export default async function Opoortunity_Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  return (
    <Grid
      fluid
      className=" bg-white md:col-span-6 md:bg-transparent xl:col-span-9"
    >
      <TrpcRootProvider>
        <main className="col-span-full bg-white xl:col-span-9">{children}</main>
        <aside className=" hidden xl:col-span-3 xl:block">{see_also}</aside>
      </TrpcRootProvider>
    </Grid>
  );
}
