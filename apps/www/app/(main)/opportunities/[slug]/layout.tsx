//

import { Grid } from "@1.ui/react/grid";
import { type PropsWithChildren } from "react";
// import SeeAlso_Page from "./@see_also/page";

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
      <main className="col-span-full bg-white xl:col-span-9">{children}</main>
      <aside className=" hidden xl:col-span-3 xl:block">{see_also}</aside>
    </Grid>
  );
}
