///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import { Aside } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { Suspense, type PropsWithChildren } from "react";
import { OpportunityCategories } from "./OpportunityCategories";
import { OpportunityFilterContextProvider } from "./OpportunityFilter.context";
import { SearchForm } from "./SearchForm";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UserBar />
      <Grid>
        <OpportunityFilterContextProvider pathname="/opportunity">
          <Aside title="Opportunités">
            <Suspense fallback={null}>
              <SearchForm />
            </Suspense>
            <OpportunityCategories />
          </Aside>

          {children}
        </OpportunityFilterContextProvider>
      </Grid>
      <AppFooter />
    </>
  );
}
