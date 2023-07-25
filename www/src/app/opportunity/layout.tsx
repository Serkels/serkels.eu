///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { AsideWithTitle } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { Suspense, type PropsWithChildren } from "react";
import { CategoriesList } from "./CategoryList";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { OpportunityCategories } from "./OpportunityRepository";
import { SearchForm } from "./SearchForm";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <OpportunityFilterContextProvider pathname="/opportunity">
          <AsideWithTitle title="Opportunités">
            <Suspense fallback={null}>
              <SearchForm />
            </Suspense>
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
    const categories = await OpportunityCategories.load();
    if (!categories) return <>No data O_o</>;

    return <CategoriesList categories={categories} />;
  } catch (error) {
    console.error(error);
    return null;
  }
}
