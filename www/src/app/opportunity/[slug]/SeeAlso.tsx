"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { OpportunityCard } from "../OpportunityCard";

//

export function SeeAlso({ category }: { category: string }) {
  const opportunity_category_query = () => opportunity_query(category);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["opportunity", 2, { category }],
    queryFn: opportunity_category_query,
  });
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
            <Link href={`/opportunity/${opportunity.id}`}>
              <OpportunityCard />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

async function opportunity_query(category: string) {
  return Array.from({ length: 2 }).map((_, i) => ({
    id: i,
    slug: "slug" + i,
    date: new Date(i),
    user: { name: "foo" + i, location: "University" + i },
    isOnline: i % 3 === 0,
    location: "Location" + i,
    title: "Opportunity Title" + i,
    description: "Opportunity description" + i,
    category,
    seat: "seat" + i,
    maxRoom: "maxRoom" + i,
  }));
}
