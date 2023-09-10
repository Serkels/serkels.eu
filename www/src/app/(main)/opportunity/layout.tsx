///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { get_StrapiRepository } from "~/core";
import { getQueryClient } from "~/core/getQueryClient";
import { Categories_Repository } from "~/modules/categories/Categories_Repository";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";
import { CategoriesList } from "./page.client";

export default async function Layout({ children }: PropsWithChildren) {
  const strapi_repository = await get_StrapiRepository();
  const repository = new Categories_Repository(strapi_repository);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: Categories_Repository.keys.opportunity(),
    queryFn: () => repository.opportunity(),
  });
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
