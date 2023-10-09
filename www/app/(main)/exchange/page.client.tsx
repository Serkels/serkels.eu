"use client";

import { TRPC_REACT } from ":trpc/index";
import { useInject } from "@1/next-tsyringe";
import { getNextPageParam, getPreviousPageParam } from "@1/strapi-openapi";
import { Button } from "@1/ui/components/ButtonV";

//

export function Exchange_List() {
  const trpc_react = useInject(TRPC_REACT);
  const query_info = trpc_react.exchange.all.useInfiniteQuery(
    {
      pagination: { pageSize: 1 },
    },
    {
      getNextPageParam,
      getPreviousPageParam,
    },
  );

  return (
    <>
      <Button onPress={() => query_info.fetchNextPage()}>next</Button>
      {/* <Exchange_InfiniteList info={query_info} /> */}
      {JSON.stringify({ query_info }, null, 2)}
    </>
  );
}
