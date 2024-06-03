//

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Grid } from "@1.ui/react/grid";
import type { PropsWithChildren, ReactNode } from "react";
import { Filter } from "./_client/Filter";
import { CategoriesList } from "./_client/FilterByCategory";

//

export default async function Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: ReactNode }>) {
  await TRPC_SSR.category.forum.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="col-span-2 sm:col-span-6 md:col-span-2 md:block lg:col-span-2 xl:col-span-3"
          slot-title="Forum StudHelp"
        >
          <Filter />

          <hr className="my-10" />

          <CategoriesList />
        </AsideFilter>
        <div className="col-span-full my-10 md:col-span-6">{children}</div>
        <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
          {see_also}
        </aside>
      </Grid>
    </TRPC_Hydrate>
  );
}
