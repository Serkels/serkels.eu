"use client";

import { TRPC_React } from ":trpc/client";
import { Exchange_Card } from ":widgets/exchanges/card";
import { Exchange_Filter, type Exchange } from "@1.modules/exchange.domain";
import { Exchange_AsyncCard } from "@1.modules/exchange.ui/Card/AsyncCard";
import { Exchange_InfiniteList } from "@1.modules/exchange.ui/InfiniteList";
import { ErrorOccur } from "@1.ui/react/error";
import { useSearchParams } from "next/navigation";
import { useEffect, type ComponentProps, type ReactNode } from "react";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter_parsed_return = Exchange_Filter.safeParse(
    search_params.get("f"),
  );
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  try {
    const info = TRPC_React.exchanges.find.useInfiniteQuery(
      {
        category,
        filter,
        search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as ComponentProps<typeof Exchange_InfiniteList>["info"];

    return (
      <Exchange_InfiniteList info={info}>
        {({ id }) => (
          <Exchange_byId key={id} id={id}>
            {(exchange) => <Exchange_Card {...exchange} />}
          </Exchange_byId>
        )}
      </Exchange_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

export function Exchange_byId({
  children,
  id,
}: {
  id: string;
  children: (exchange: Exchange) => ReactNode;
}) {
  const info = TRPC_React.exchanges.by_id.useQuery(id);
  return (
    <Exchange_AsyncCard
      info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
    >
      {({ exchange }) => children(exchange)}
    </Exchange_AsyncCard>
  );
}
