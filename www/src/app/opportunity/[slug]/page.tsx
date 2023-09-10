//

import { injector } from "~/core/di";
import { Opportunity_Repository } from "~/modules/opportunity/opportunity.repository";
import { OpportunityArticle } from "./OpportunityArticle";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const repository = injector().resolve(Opportunity_Repository);

  try {
    const data = await repository.find_by_slug(slug);
    const category = data.attributes?.category?.data?.attributes?.slug;

    return (
      <>
        <main className="col-span-full bg-white md:col-span-6 xl:col-span-9">
          <OpportunityArticle
            slug={slug}
            data={data}
            category={category ?? "autres"}
          />
        </main>
        <aside className="col-span-3 hidden lg:px-10">
          <SeeAlso category={category ?? "autres"} />
        </aside>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <main className="col-span-full bg-white md:col-span-6 xl:col-span-9">
        <article className="px-4 pt-40 lg:px-16">
          <h1 className="text-4xl font-bold">Page introuvable.</h1>
        </article>
      </main>
    );
  }
}
