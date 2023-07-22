//

import type { components } from "@1/strapi-openapi/v1";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
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
    <>
      <main className="relative -z-10 col-span-full bg-white md:col-span-6 xl:col-span-9">
        <OpportunityArticle
          slug={slug}
          initialData={data}
          category={category ?? "autres"}
        />
      </main>
      <aside className="col-span-3 hidden lg:px-10">
        <SeeAlso category={category ?? "autres"} />
      </aside>
    </>
  );
}

async function getData(slug: string) {
  const res = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/opportunities?populate=*&filters[slug][$eq]=${slug}`,
    {
      next: { revalidate: 86400 as _24_HOURS_ },
    },
  );

  if (!res.ok) {
    throw new Error("Not Found");
  }

  return res.json() as Promise<
    components["schemas"]["OpportunityListResponse"]
  >;
}
