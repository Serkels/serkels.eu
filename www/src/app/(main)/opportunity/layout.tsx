///

import { NextTsyringe } from "@1/next-tsyringe";
import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Main_Module } from "../layout";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";
import { CategoriesList } from "./page.client";

//

@NextTsyringe.module({
  parent: Main_Module,
})
export class Opoortunity_Module {
  static Provider = Opoortunities_Layout;
}
export default Opoortunity_Module.Provider;

//
//
//

export async function Opoortunities_Layout({ children }: PropsWithChildren) {
  const container = await NextTsyringe.injector(Opoortunity_Module);
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
