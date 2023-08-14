///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { AsideWithTitle } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { type PropsWithChildren } from "react";
import { CategoriesList } from "./(page)";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";
import { OpportunityCategories } from "./data/OpportunityCategories";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <OpportunityFilterContextProvider>
          <AsideWithTitle title="Opportunités">
            <SearchForm />
            <Categories />
          </AsideWithTitle>

          {children}
        </OpportunityFilterContextProvider>
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
