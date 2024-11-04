//

import { AsideFilter } from ":components/shell/AsideFilter";
import { Grid } from "@1.ui/react/grid";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import type { PropsWithChildren, ReactNode } from "react";
import { Filter } from "./_client/Filter";

//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  loading() {
    return <InputSearch />;
  },
});

export default async function Layout({
  categories,
  children,
  see_also,
}: PropsWithChildren<{ categories: ReactNode; see_also: ReactNode }>) {
  return (
    <Grid>
      <AsideFilter
        className="col-span-2 sm:col-span-6 md:col-span-2 md:block lg:col-span-2 xl:col-span-3"
        slot-title="Discussions"
        subtitle="Trouvez les questions et les réponses posés par les étudiant.e.s"
      >
        <SearchForm />
        <Filter />
        <hr className="my-5 md:my-10" />

        {categories}
      </AsideFilter>
      <div className="col-span-full md:col-span-6 md:my-10">{children}</div>
      <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
        {see_also}
      </aside>
    </Grid>
  );
}
