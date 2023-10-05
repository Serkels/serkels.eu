"use client";

import { trpc } from ":trpc/client";
import type { Common_PaginationMeta_Schema } from "@1/strapi-openapi";
import { Button } from "@1/ui/components/ButtonV";

//

export function getNextPageParam_<
  TQueryFnData extends Common_PaginationMeta_Schema,
>(lastPage: TQueryFnData) {
  const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
  const { pageCount, page } = pagination;
  if (pageCount === undefined || page === undefined) return;

  return page >= pageCount ? undefined : page + 1;
}

function getNextPageParam(lastPage: Common_PaginationMeta_Schema | undefined) {
  console.log("getNextPageParam", ...arguments);

  const pagination = lastPage?.meta?.pagination ?? { pageCount: 0, page: 0 };
  const { pageCount, page } = pagination;
  if (pageCount === undefined || page === undefined) return;
  return page >= pageCount ? undefined : page + 1;
}
export function Exchange_List() {
  const query_info = trpc.exchange.all.useInfiniteQuery(
    {
      pagination: { pageSize: 1 },
    },
    {
      getNextPageParam,
    },
  );
  return (
    <>
      <Button onPress={() => query_info.fetchNextPage()}>next</Button>
      <code>{JSON.stringify({ query_info }, null, 2)}</code>
    </>
  );
}
