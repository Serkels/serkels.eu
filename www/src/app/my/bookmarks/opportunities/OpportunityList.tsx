"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { fromClient } from "~/app/api/v1";
import { OpportunityCard } from "~/app/opportunity/OpportunityCard";
import { get_bookmark_opportunities_ids } from "~/components/get_session_bookmarks_id";
import { useBookmarksQuery } from "../data/useBookmarksQuery";

//

export function OpportunityList() {
  const { data: session } = useSession();

  const { data, isLoading, isError } = useBookmarkedOpportunities();

  if (!session) return null;
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
              cover={opportunity.attributes?.cover!}
              expireAt={opportunity.attributes?.expireAt!}
              id={String(opportunity.id)}
              location={opportunity.attributes?.location!}
              opportunity_category={
                opportunity.attributes?.opportunity_category!
              }
              partner={opportunity.attributes?.partner!}
              title={opportunity.attributes?.title!}
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

function useBookmarkedOpportunities() {
  const { data: bookmarks } = useBookmarksQuery();

  const bookmark_ids = get_bookmark_opportunities_ids(bookmarks?.data);
  return useQuery({
    enabled: Boolean(bookmark_ids),
    queryKey: ["my", "bookmarks", "opportunities"],
    queryFn: async () => {
      if (!bookmark_ids?.length) return [];

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
            filters: { $or: bookmark_ids.map((id) => ({ id })) },
          },
        },
      });

      if (error) {
        console.error(error, "from " + response.url);
      }

      return body?.data ?? [];
    },
    staleTime: Infinity,
  });
}
