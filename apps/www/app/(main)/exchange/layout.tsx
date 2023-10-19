///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import InputSearch from "@1.ui/react/input/InputSearch";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { PropsWithChildren, ReactNode } from "react";
import { CategoriesList } from "./_client/CategoriesList";

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
  const session = await getServerSession();
  console.log({ session });
  // if (!session) {
  //   return notFound();
  // }

  await TRPC_SSR.category.exchange.prefetch();
  const dehydratedState = dehydrate(TRPC_SSR.queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Grid>
        <AsideFilter
          className="mt-10 hidden md:col-span-2 md:block xl:col-span-3"
          slot-title="Échanges"
        >
          <SearchForm />
          {/* <ExhangesFilter /> */}
          <hr className="my-10" />

          <CategoriesList />
        </AsideFilter>
        <div className="col-span-full my-10 md:col-span-6">{children}</div>
        <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
          {see_also}
        </aside>
      </Grid>
    </Hydrate>
  );
}
