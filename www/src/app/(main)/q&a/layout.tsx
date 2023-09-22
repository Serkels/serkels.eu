///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AsideWithTitle } from "~/components/layouts/holy/aside";
import { injector } from "~/core/di";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { CategoriesList, QAFilter } from "./page.client";

export default async function Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  const queryClient = await injector()
    .resolve(Get_Category_UseCase)
    .prefetch("question");
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Grid className="col-span-full">
        <AsideWithTitle title="Question-Réponse">
          <QAFilter />

          <hr className="my-10" />

          <CategoriesList />
        </AsideWithTitle>
        <div className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
          {children}
        </div>
        <aside className="col-span-3 mt-10 hidden lg:px-10 xl:block">
          {see_also}
        </aside>
      </Grid>
    </Hydrate>
  );
}
