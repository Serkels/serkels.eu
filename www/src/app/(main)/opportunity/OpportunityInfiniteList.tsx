"use client";

import type { Strapi_OpenApi_Schemas } from "@1/strapi-openapi";
import { Spinner } from "@1/ui/components/Spinner";
import Link from "next/link";
import { P, match } from "ts-pattern";
import { OpportunityCard } from "./OpportunityCard";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { Opportunity_Grid } from "./Opportunity_Item";
import { useOpportunitiesInfinite } from "./useOpportunities";

//

export function OpportunityInfiniteList() {
  const { category, query } = useOpportunityFilterContext();

  const info = useOpportunitiesInfinite({ category, query, pageSize: 8 });

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, ({}) => <Opportunity_MainGrid info={info} />)
    .exhaustive();
}

export function Opportunity_MainGrid({
  info,
}: {
  info: ReturnType<typeof useOpportunitiesInfinite>;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = info;
  const opportunities = (data ?? {}).pages?.map((page) => page.data!).flat();

  return match(opportunities)
    .with(undefined, () => null)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <Opportunity_Grid>
        {list.map((opportunity) => (
          <li key={opportunity.id}>
            <Opportunity_Item opportunity={opportunity} />
          </li>
        ))}
        <li className="col-span-full mx-auto">
          {isFetchingNextPage ? <Loading /> : null}
        </li>
        <li className="col-span-full mx-auto">
          {hasNextPage ? (
            <button
              className="
              rounded-md
              bg-gray-600
              px-3
              py-1.5
              text-sm
              font-semibold
              leading-6
              text-white
              shadow-sm
              hover:bg-gray-500
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-gray-600
            "
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Charger plus
            </button>
          ) : null}
        </li>
      </Opportunity_Grid>
    ));
}

function Opportunity_Item({
  opportunity,
}: {
  opportunity: Strapi_OpenApi_Schemas.Opportunity.ResponseDataObject;
}) {
  return (
    <Link
      className="h-full"
      href={`/opportunity/${opportunity.attributes?.slug}`}
    >
      <OpportunityCard
        className="h-full"
        cover={opportunity.attributes?.cover!}
        expireAt={opportunity.attributes?.expireAt!}
        id={String(opportunity.id)}
        location={opportunity.attributes?.location}
        category={opportunity.attributes?.category}
        partner={opportunity.attributes?.partner}
        title={opportunity.attributes?.title!}
      />
    </Link>
  );
}

function Loading() {
  return (
    <figure className="mt-28 text-center">
      <Spinner />
    </figure>
  );
}

function EmptyList() {
  return (
    <figure className="mt-28  text-center">
      <h3 className="text-xl">Aucune opportunité disponible pour le moment</h3>
    </figure>
  );
}
