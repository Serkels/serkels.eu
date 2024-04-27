"use client";

import { TRPC_React } from ":trpc/client";
import {
  Partner_Filter,
  type Opportunity,
} from "@1.modules/opportunity.domain";
import { Opportunity_InfiniteList } from "@1.modules/opportunity.ui/InfiniteList";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { P, match } from "ts-pattern";
import { Item } from "./Item";

//

export default function List() {
  const { data: session } = useSession();
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter = match(Partner_Filter.safeParse(search_params.get("f")))
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => undefined);

  useEffect(() => {
    gtag("event", "search", { search, category, filter });
  }, [search, category, filter]);

  const info = match(session)
    .with(
      { profile: P._ },
      () =>
        TRPC_React.opportunity.find.private.useInfiniteQuery(
          {
            category,
            search: search,
            filter,
          },
          {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          },
        ) as UseInfiniteQueryResult<{ data: Opportunity[] }>,
    )
    .otherwise(
      () =>
        TRPC_React.opportunity.find.public.useInfiniteQuery(
          {
            category,
            search: search,
          },
          {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          },
        ) as UseInfiniteQueryResult<{ data: Opportunity[] }>,
    );

  return (
    <Opportunity_InfiniteList info={info}>
      {(data) => <Item opportunity={data} />}
    </Opportunity_InfiniteList>
  );
}
