///

import { AsideFilter } from ":components/shell/AsideFilter";
import { Banner } from ":components/shell/Banner";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Grid } from "@1.ui/react/grid";
import InputSearch from "@1.ui/react/input/InputSearch";
import to from "await-to-js";
import { getServerSession } from "next-auth";
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
  const [, session] = await to(getServerSession());
  if (!session)
    return (
      <Banner className="flex-col justify-center">
        <h2
          className={`mx-auto my-0 text-center text-6xl font-extrabold text-red-100`}
        >
          Vous n'êtes pas autorisé à accéder à cette page.
        </h2>
      </Banner>
    );

  await TRPC_SSR.category.exchange.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="col-span-2 sm:col-span-6 md:col-span-2 md:block lg:col-span-2 xl:col-span-3"
          slot-title="Échanges"
          subtitle="Trouvez les échanges proposés par les étudiant.e.s"
        >
          <SearchForm />
          <Exchanges_Filter />

          <hr className="my-5 md:my-10" />

          <Categories_List />
        </AsideFilter>
        <div className="col-span-full md:col-span-6 md:my-10">{children}</div>
        <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
          {see_also}
        </aside>
      </Grid>
    </TRPC_Hydrate>
  );
}
