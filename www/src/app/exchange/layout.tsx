///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { AsideWithTitle } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { type PropsWithChildren } from "react";
import { OpportunityCategories } from "../opportunity/data/OpportunityCategories";
import { CategoriesList, SearchForm } from "./(page)";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <AsideWithTitle title="Échanges">
          <SearchForm />
          {/* <ExhangesFilter /> */}
          <hr className="my-10" />

          <Categories />
        </AsideWithTitle>
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}

export async function Categories() {
  try {
    const data = await OpportunityCategories.load();

    if (!data) return <>No data O_o</>;

    return <CategoriesList data={data} />;
  } catch (error) {
    console.error(error);
    return null;
  }
}
