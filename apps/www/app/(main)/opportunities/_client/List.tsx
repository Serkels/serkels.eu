"use client";

import { TRPC_React } from ":trpc/client";
import type { Opportunity } from "@1.modules/opportunity.domain";
import {
  Opoortunity_Card,
  Opoortunity_InfiniteList,
} from "@1.modules/opportunity.ui";
import { ErrorOccur } from "@1.ui/react/error";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

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
      <Opoortunity_InfiniteList info={info}>
        {(data) => <Item {...data} />}
      </Opoortunity_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Item(props: Opportunity) {
  const { slug } = props;
  return (
    <Link className="h-full" href={`/opportunities/${slug}`}>
      <Opoortunity_Card {...props} />
    </Link>
  );
}
