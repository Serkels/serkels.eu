//

import { Aside } from "@/layouts/holy/aside";
import type { components } from "@1/strapi-openapi/v1";
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
      {categories.map(({ name, slug }) => (
        <li className="mb-3" key={slug}>
          <label>
            <input type="radio" name="category" value={slug} />
            <span className="ml-2">{name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

async function opportunity_categories_query() {
  const res = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/opportunity-categories`
  );
  const result = await res.json();
  if (result.error) {
    console.error(result.error);
    throw result.error;
  }
  const { data } = result as NonNullable<
    components["schemas"]["OpportunityCategoryListResponse"]
  >;
  if (!data) {
    return [];
  }
  return await data.map(({ id, attributes }) => ({ id, ...attributes }));
}
