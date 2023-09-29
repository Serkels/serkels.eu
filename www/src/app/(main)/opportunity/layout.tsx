///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { injector } from "~/core/react";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";
import { CategoriesList } from "./page.client";

export default async function Layout({ children }: PropsWithChildren) {
  const container = await injector();
  const queryClient = await container
    .resolve(Get_Category_UseCase)
    .prefetch("opportunity");
  const dehydratedState = dehydrate(queryClient);

  //

  return (
    <Hydrate state={dehydratedState}>
      <Grid className="col-span-full">
        <OpportunityFilterContextProvider>
          <AsideWithTitle title="Opportunités">
            <SearchForm />
            <CategoriesList />
          </AsideWithTitle>

          {children}
        </OpportunityFilterContextProvider>
      </Grid>
    </Hydrate>
  );
}
