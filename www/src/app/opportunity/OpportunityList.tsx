"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OpportunityCard } from "./OpportunityCard";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { useOpportunities } from "./useOpportunities";

//

export function OpportunityList() {
  const {} = useSession();
  const { category } = useOpportunityFilterContext();
  const { data, isLoading, isError } = useOpportunities({ category });

  if (isLoading) return <Loading />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  if (data.length === 0) return <EmptyList />;
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
      {data.map((opportunity) => (
        <li key={opportunity.id} className="mx-auto max-w-2xl">
          <Link href={`/opportunity/${opportunity.slug}`}>
            <OpportunityCard {...opportunity} />
          </Link>
        </li>
      ))}
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
