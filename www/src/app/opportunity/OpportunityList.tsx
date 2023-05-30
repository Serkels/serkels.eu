"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OpportunityCard } from "./OpportunityCard";

//

export function OpportunityList() {
  const {} = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["opportunity"],
    queryFn: opportunity_query,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  return (
    <ul
      className={`
        grid
        grid-flow-row
        grid-cols-1
        gap-8
        px-8
        sm:grid-cols-2
        sm:px-0
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      `}
    >
      {data.map((opportunity) => (
        <li key={opportunity.id} className="mx-auto max-w-2xl">
          <Link href={`/opportunity/${opportunity.id}`}>
            <OpportunityCard />
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function opportunity_query() {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    slug: "slug" + i,
    date: new Date(i),
    user: { name: "foo" + i, location: "University" + i },
    isOnline: i % 3 === 0,
    location: "Location" + i,
    title: "Opportunity Title" + i,
    description: "Opportunity description" + i,
    category: "category" + i,
    seat: "seat" + i,
    maxRoom: "maxRoom" + i,
  }));
}
