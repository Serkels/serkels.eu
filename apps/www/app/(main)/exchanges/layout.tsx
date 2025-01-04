///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TrpcRootProvider } from ":trpc/root";
import { Exchanges_Filter } from ":widgets/exchanges/filter";
import { SearchForm } from ":widgets/exchanges/list";
import { Grid } from "@1.ui/react/grid";
import type { PropsWithChildren, ReactNode } from "react";

//

export default async function Layout({
  categories,
  children,
  see_also,
}: PropsWithChildren<{ categories: ReactNode; see_also: ReactNode }>) {
  return (
    <Grid>
      <AsideFilter
        className="col-span-2 sm:col-span-6 md:col-span-2 md:block lg:col-span-2 xl:col-span-3"
        slot-title="Échanges"
        subtitle="Trouvez les échanges proposés par les étudiant.e.s"
      >
        <SearchForm />
        <Exchanges_Filter />

        <hr className="my-5 md:my-10" />

        <TrpcRootProvider>{categories}</TrpcRootProvider>
      </AsideFilter>
      <TrpcRootProvider>
        <div className="col-span-full md:col-span-6 md:my-10">{children}</div>
      </TrpcRootProvider>
      <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
        <TrpcRootProvider>{see_also}</TrpcRootProvider>
      </aside>
    </Grid>
  );
}
