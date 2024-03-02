///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Grid } from "@1.ui/react/grid";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import type { PropsWithChildren, ReactNode } from "react";
import { Categories_List } from "./_client/Categories_Filter";
import { Exchanges_Filter } from "./_client/Exchanges_Filter";

//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

//

export default async function Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: ReactNode }>) {
  await TRPC_SSR.category.exchange.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="hidden md:col-span-2 md:block xl:col-span-3"
          slot-title="Échanges"
        >
          <SearchForm />
          <Exchanges_Filter />

          <hr className="my-10" />

          <Categories_List />
        </AsideFilter>
        <div className="col-span-full my-10 md:col-span-6">{children}</div>
        <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
          {see_also}
        </aside>
      </Grid>
    </TRPC_Hydrate>
  );
}
