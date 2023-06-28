"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OpportunityCard } from "./OpportunityCard";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { useOpportunitiesInfinite } from "./useOpportunities";

//

export function OpportunityList() {
  const {} = useSession();
  const { category } = useOpportunityFilterContext();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOpportunitiesInfinite({ category });

  if (isLoading) return <Loading />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  const { pages } = data;
  if (pages[0]?.data?.length === 0) return <EmptyList />;
  return (
    <ul
      className={`
        grid
        grid-flow-row
        grid-cols-2
        gap-8
        px-8
        sm:px-0
        md:grid-cols-3
        xl:grid-cols-4
      `}
    >
      {pages
        .map((page) => page.data!)
        .filter(Boolean)
        .flat()
        .map((opportunity) => (
          <li key={opportunity.id}>
            <Link
              className="h-full"
              href={`/opportunity/${opportunity.attributes?.slug}`}
            >
              <OpportunityCard
                className="h-full"
                {...{ ...opportunity.attributes!, id: opportunity.id }}
              />
            </Link>
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
    </ul>
  );
}

function Loading() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <Spinner />
    </figure>
  );
}

function EmptyList() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <h3 className="text-xl">Aucune opportunité disponible pour le moment</h3>
    </figure>
  );
}
