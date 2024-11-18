"use client";

import { Card } from ":widgets/opportunities/card";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import { Partner_Filter } from "@1.modules/opportunity.domain";
import { Opportunity_InfiniteList } from "@1.modules/opportunity.ui/InfiniteList";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { match } from "ts-pattern";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter = match(Partner_Filter.safeParse(search_params.get("f")))
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => undefined);

  useEffect(() => {
    gtag("event", "search", { search, category, filter });
  }, [search, category, filter]);

  const info = trpc_client.opportunity.find.useInfiniteQuery(
    {
      category,
      search,
      filter,
    },
    {
      getNextPageParam: (lastPage) => lastPage.next_cursor,
    },
  );

  return (
    <Opportunity_InfiniteList info={info}>
      {(data) => <Card opportunity={data} />}
    </Opportunity_InfiniteList>
  );
}
