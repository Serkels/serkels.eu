"use client";

import type { inferInfiniteQueryObserverSuccessResult } from ":components/inferQueryResult";
import { TRPC_React } from ":trpc/client";
import { Exchange_Card } from ":widgets/exchanges/card";
import type { Entity } from "@1.modules/core/domain";
import { Exchange_Filter, type Exchange } from "@1.modules/exchange.domain";
import { Exchange_AsyncCard } from "@1.modules/exchange.ui/Card/AsyncCard";
import { EmptyList, Loading, LoadMoreButton } from "@1.ui/react/async";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, type ComponentProps, type ReactNode } from "react";
import { match, P } from "ts-pattern";
import type { z } from "zod";
import Loading_Placeholder from "../loading";

//

function useQueryExchanges(input: {
  category: string | undefined;
  filter: z.infer<typeof Exchange_Filter> | undefined;
  search: string | undefined;
}) {
  return TRPC_React.exchanges.find.useInfiniteQuery(input, {
    getNextPageParam: ({ next_cursor }) => next_cursor,
  });
}
type QueryExchanges = ReturnType<typeof useQueryExchanges>;
type QueryExchangesSuccessResult =
  inferInfiniteQueryObserverSuccessResult<QueryExchanges>;

//

export default function AsyncInfiniteList() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter = match(Exchange_Filter.safeParse(search_params.get("f")))
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => undefined);

  const query_info = useQueryExchanges({
    category,
    filter,
    search,
  });

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, (success_info) => <List {...success_info} />)
    .exhaustive();
}

//

function List(query_info: QueryExchangesSuccessResult) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  if (flatten_pages.length === 0)
    return <EmptyList>Pas plus de résultats ...</EmptyList>;

  return (
    <ul className="grid grid-cols-1 gap-9">
      {flatten_pages.map((item) => (
        <li key={item.id}>
          <Item {...item} />
        </li>
      ))}
      {match({ isFetchingNextPage, hasNextPage })
        .with({ isFetchingNextPage: true }, () => <Loading_Placeholder />)
        .with({ hasNextPage: true }, () => (
          <li className="col-span-full p-8 text-center">
            <LoadMoreButton onPress={() => fetchNextPage()}>
              Charger plus
            </LoadMoreButton>
          </li>
        ))
        .otherwise(() => null)}
    </ul>
  );
}

//

function Item({ id }: Entity) {
  const { data: session } = useSession();
  return (
    <Exchange_byId key={id} id={id}>
      {(exchange) => (
        <Exchange_Card exchange={exchange} profile={session?.profile} />
      )}
    </Exchange_byId>
  );
}

//

function useQueryExchangeById(id: string) {
  return TRPC_React.exchanges.by_id.useQuery(id);
}

function Exchange_byId({
  children,
  id,
}: {
  id: string;
  children: (exchange: Exchange) => ReactNode;
}) {
  const info = useQueryExchangeById(id);
  return (
    <Exchange_AsyncCard
      info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
    >
      {({ exchange }) => children(exchange)}
    </Exchange_AsyncCard>
  );
}
