///

import { AuthError } from "@1/core/error";
import { NextTsyringe } from "@1/next-tsyringe";
import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Main_Module } from "../layout";
import { CategoriesList, SearchForm } from "./page.client";

//

@NextTsyringe.module({
  parent: Main_Module,
})
export class Exchange_Module {
  static Provider = Exchange_Layout;
}
export default Exchange_Module.Provider;

//
//
//
//
//
//
//
//
//

async function Exchange_Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  const container = NextTsyringe.injector(Exchange_Module);

  const jwt = container.resolve(JWT_TOKEN);
  if (!jwt) {
    console.log({ jwt });
    throw new AuthError("Unauthenticated");
  }

  const queryClient = await container
    .resolve(Get_Category_UseCase)
    .prefetch("exchange");

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Grid className="col-span-full">
        <AsideWithTitle title="Échanges">
          <SearchForm />
          {/* <ExhangesFilter /> */}
          <hr className="my-10" />

          <CategoriesList />
        </AsideWithTitle>
        <div className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
          {children}
        </div>
        <aside className="mt-10 hidden xl:col-span-3 xl:block xl:px-10">
          {see_also}
        </aside>
      </Grid>
    </Hydrate>
  );
}
