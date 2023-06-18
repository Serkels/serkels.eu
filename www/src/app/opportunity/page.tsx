//

import { Aside } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { InputSearch } from "@1/ui/components/InputSearch";
import { OpportunityCategories } from "./OpportunityCategories";
import { OpportunityList } from "./OpportunityList";

//
export const revalidate = 60;

export default async function Page() {
  return (
    <Grid>
      <Aside title="Opportunités">
        <InputSearch />
        {/* @ts-expect-error Server Component */}
        {false && <OpportunityCategories />}
      </Aside>
      <main className="col-span-full mt-10 md:col-span-6 xl:col-span-9">
        <OpportunityList />
      </main>
    </Grid>
  );
}
