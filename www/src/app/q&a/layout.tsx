///

import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { AsideWithTitle } from "~/layouts/holy/aside";
import { getQueryClient } from "../getQueryClient";
import { useOpportunityCategoriesprefetchQuery } from "../opportunity/data/useOpportunityCategoriesQuery";
import { CategoriesList, QAFilter } from "./(page)";

export default async function Layout({
  children,
  see_also,
}: PropsWithChildren<{ see_also: React.ReactNode }>) {
  const queryClient = getQueryClient();
  await useOpportunityCategoriesprefetchQuery();
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <Hydrate state={dehydratedState}>
          <AsideWithTitle title="Question-Réponse">
            <QAFilter />

            <hr className="my-10" />

            <CategoriesList />
          </AsideWithTitle>
          {children}
        </Hydrate>
        <aside className="col-span-3 mt-10 hidden lg:px-10 xl:block">
          {see_also}
        </aside>
      </Grid>
      <AppFooter />
    </div>
  );
}
