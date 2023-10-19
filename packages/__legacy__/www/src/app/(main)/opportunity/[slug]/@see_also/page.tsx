//

import { NextTsyringe } from "@1/next-tsyringe";
import Link from "next/link";
import { Main_Module } from "~/app/(main)/layout";
import { Opportunity_Repository } from "~/modules/opportunity/opportunity.repository";
import { OpportunityCard } from "../../OpportunityCard";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const container = await NextTsyringe.injector(Main_Module);
  const repository = container.resolve(Opportunity_Repository);
  const opportunity = await repository.find_by_slug(slug);

  const category = opportunity.attributes?.category?.data?.attributes?.slug;
  const { data } = await repository.find_all({
    filters: { category },
    pagination: { pageSize: 2 },
  });

  if (!data) return <>No data O_o</>;
  return (
    <article>
      <h2 className="mb-7 mt-10 text-center  text-lg font-bold text-Congress_Blue">
        Voir aussi
      </h2>

      <ul>
        {data.map((opportunity) => (
          <li key={opportunity.id} className="mx-auto mb-7 max-w-[188px]">
            <Link href={`/opportunity/${opportunity.attributes?.slug}`}>
              <OpportunityCard
                cover={opportunity.attributes?.cover!}
                expireAt={opportunity.attributes?.expireAt!}
                id={String(opportunity.id)}
                location={opportunity.attributes?.location!}
                category={opportunity.attributes?.category!}
                partner={opportunity.attributes?.partner!}
                title={opportunity.attributes?.title!}
              />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
