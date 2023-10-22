///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Grid } from "@1.ui/react/grid";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";
import { Categoriy_Filter } from "./_client/Categoriy_Filter";
//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

//

export default async function Layout({ children }: PropsWithChildren<{}>) {
  await TRPC_SSR.category.opportunity.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="mt-10 hidden md:col-span-2 md:block xl:col-span-3"
          slot-title="Opportunités"
        >
          <SearchForm />

          <hr className="my-10" />

          <Categoriy_Filter />
        </AsideFilter>
        <div className="col-span-full  md:col-span-6 xl:col-span-9">
          {children}
        </div>
      </Grid>
    </TRPC_Hydrate>
  );
}
