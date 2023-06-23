"use client";

import { useOpportunities } from "@/app/opportunity/useOpportunities";
import { Spinner } from "@1/ui/components/Spinner";
import Link from "next/link";
import { OpportunityCard } from "../OpportunityCard";

//

export function SeeAlso({ category }: { category: string }) {
  const { data, isLoading, isError } = useOpportunities({ limit: 2, category });

  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  return (
    <article>
      <h2 className="mb-7 mt-10 text-center  text-lg font-bold text-Congress_Blue">
        Voir aussi
      </h2>

      <ul>
        {data.map((opportunity) => (
          <li key={opportunity.id} className="mx-auto mb-7 max-w-[188px]">
            <Link href={`/opportunity/${opportunity.slug}`}>
              <OpportunityCard {...opportunity} />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
