"use client";

import { fromClient } from "@/app/api/v1";
import { OpportunityCard } from "@/app/opportunity/OpportunityCard";
import { get_session_bookmarks_id } from "@/components/get_session_bookmarks_id";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

//

export function OpportunityList() {
  const { data: session } = useSession();
  if (!session) return null;

  const { data, isLoading, isError } = useBookmarkedOpportunities(
    get_session_bookmarks_id(session),
  );

  if (isLoading) return <Loading />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  if (data?.length === 0) return <EmptyList />;
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

function useBookmarkedOpportunities(ids: string[]) {
  return useQuery({
    queryKey: ["opportunities", ids.sort()],
    queryFn: async () => {
      const {
        response,
        data: body,
        error,
      } = await fromClient.GET("/opportunities", {
        params: {
          query: {
            populate: {
              cover: { fields: ["formats", "url"] },
              opportunity_category: { fields: ["name"] },
              partner: { fields: ["name", "avatar"], populate: ["avatar"] },
            } as any,
            filters: { $or: ids.map((id) => ({ id })) },
          },
        },
      });

      if (error) {
        console.error(error, "from " + response.url);
      }

      return body?.data ?? [];
    },
  });
}
