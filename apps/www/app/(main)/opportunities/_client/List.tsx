"use client";

import { TRPC_React } from ":trpc/client";
import type { Opportunity } from "@1.modules/opportunity.domain";
import { Opoortunity_Card } from "@1.modules/opportunity.ui/Card";
import { Opportunity_InfiniteList } from "@1.modules/opportunity.ui/InfiniteList";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { ErrorOccur } from "@1.ui/react/error";
import { Bookmark } from "@1.ui/react/icons";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  try {
    const info = TRPC_React.opportunity.find.useInfiniteQuery(
      {
        category,
        search: search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as UseInfiniteQueryResult<{ data: Opportunity[] }>;

    return (
      <Opportunity_InfiniteList info={info}>
        {(data) => <Item opportunity={data} />}
      </Opportunity_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

export function Item({ opportunity }: { opportunity: Opportunity }) {
  const { data: session } = useSession();
  const { slug } = opportunity;
  const is_studient = session?.profile.role === PROFILE_ROLES.Enum.STUDIENT;
  return (
    <Link href={`/opportunities/${slug}`}>
      <Opoortunity_Card opportunity={opportunity}>
        <Opoortunity_Card.Footer_Actions>
          {is_studient ? <BookmarkButton /> : null}
        </Opoortunity_Card.Footer_Actions>
      </Opoortunity_Card>
    </Link>
  );
}

function BookmarkButton() {
  return <Bookmark className="inline-block h-4 w-4 text-Dove_Gray" />;
}
