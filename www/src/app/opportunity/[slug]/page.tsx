//

import { Aside } from "@/layouts/holy/aside";
import type { components } from "@1/strapi-openapi/v1";
import { Grid } from "@1/ui/components/Grid";
import { InputSearch } from "@1/ui/components/InputSearch";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { OpportunityCategories } from "../OpportunityCategories";
import { OpportunityArticle } from "./OpportunityArticle";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getData(slug);

  const category =
    data?.data &&
    data.data[0]?.attributes?.opportunity_category?.data?.attributes?.slug;

  return (
    <Grid>
      <Aside title="Opportunités">
        <InputSearch />
        <OpportunityCategories />
      </Aside>
      <main className="col-span-6 bg-white">
        <OpportunityArticle slug={slug} initialData={data} />
      </main>
      <aside className="col-span-3 hidden lg:px-10">
        <SeeAlso category={category ?? "autres"} />
      </aside>
    </Grid>
  );
}

async function getData(slug: string) {
  const res = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/opportunities?populate=*&filters[slug][$eq]=${slug}`,
    {
      next: { revalidate: 86400 as _24_HOURS_ },
    }
  );

  if (!res.ok) {
    throw new Error("Not Found");
  }

  return res.json() as Promise<
    components["schemas"]["OpportunityListResponse"]
  >;
}
