///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Grid } from "@1.ui/react/grid";
import type { PropsWithChildren } from "react";
// import { CategoriesList } from "./_client/CategoriesList";
// import { ExchangeFilter } from "./_client/ExchangeFilter";

//

// const SearchForm = dynamic(() => import("./_client/SearchForm"), {
//   ssr: false,
//   loading() {
//     return <InputSearch />;
//   },
// });

//

export default async function Layout({ children }: PropsWithChildren<{}>) {
  const session = await getServerSession();
  console.log({ session });
  // if (!session) {
  //   return notFound();
  // }

  await TRPC_SSR.category.exchange.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="mt-10 hidden md:col-span-2 md:block xl:col-span-3"
          slot-title="Opportunités"
        >
          {/* <SearchForm /> */}
          {/* <ExchangeFilter /> */}

          <hr className="my-10" />

          {/* <CategoriesList /> */}
        </AsideFilter>
        <div className="col-span-full my-10 md:col-span-6">{children}</div>
      </Grid>
    </TRPC_Hydrate>
  );
}
