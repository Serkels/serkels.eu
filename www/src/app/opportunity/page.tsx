//

import { Aside } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import { InputSearch } from "@1/ui/components/InputSearch";
import { OpportunityList } from "./OpportunityList";

//

export default async function Page() {
  return (
    <Grid>
      <Aside title="Opportunités">
        <InputSearch />
        {/* @ts-expect-error Server Component */}
        <OpportunityCategories />
      </Aside>
      <main className="col-span-full mt-10 md:col-span-6 xl:col-span-9">
        <OpportunityList />
      </main>
    </Grid>
  );
}

//

async function OpportunityCategories() {
  const categories = await opportunity_categories_query();
  return (
    <ul className="mt-7 text-[#656565]">
      {categories.map((name) => (
        <li className="mb-3" key={name}>
          <label>
            <input type="radio" name="category" value={name} checked={true} />
            <span className="ml-2">{name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

async function opportunity_categories_query() {
  return await ["Cours de français", "Bourses", "Logements"];
}
