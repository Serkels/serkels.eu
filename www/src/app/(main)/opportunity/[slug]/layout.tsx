///

import { Grid } from "@1/ui/components/Grid";
import { type PropsWithChildren } from "react";

export default async function Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  return (
    <Grid
      $padding={false}
      className="col-span-full bg-white md:col-span-6 md:bg-transparent xl:col-span-9"
    >
      <main className="col-span-full bg-white xl:col-span-9">{children}</main>
      <aside className=" hidden xl:col-span-3 xl:block">{see_also}</aside>
    </Grid>
  );
}
