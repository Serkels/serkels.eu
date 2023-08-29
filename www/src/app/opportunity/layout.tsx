///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { AsideWithTitle } from "~/layouts/holy/aside";
import { getQueryClient } from "../getQueryClient";
import { CategoriesList } from "./(page)";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";
import { useOpportunityCategoriesprefetchQuery } from "./data/useOpportunityCategoriesQuery";

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  await useOpportunityCategoriesprefetchQuery();
  const dehydratedState = dehydrate(queryClient);

  //

  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <Hydrate state={dehydratedState}>
          <OpportunityFilterContextProvider>
            <AsideWithTitle title="Opportunités">
              <SearchForm />
              <CategoriesList />
            </AsideWithTitle>

            {children}
          </OpportunityFilterContextProvider>
        </Hydrate>
      </Grid>
      <AppFooter />
    </div>
  );
}
