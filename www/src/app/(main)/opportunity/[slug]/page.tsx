//

import { injector } from "~/core/react";
import { Opportunity_Repository } from "~/modules/opportunity/opportunity.repository";
import { OpportunityArticle } from "./OpportunityArticle";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const repository = injector().resolve(Opportunity_Repository);

  try {
    const data = await repository.find_by_slug(slug);
    const category = data.attributes?.category?.data?.attributes?.slug;

    return (
      <OpportunityArticle
        slug={slug}
        data={data}
        category={category ?? "autres"}
      />
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
