"use client";

import { TRPC_React } from ":trpc/client";
import type { Exchange } from "@1.modules/exchange.domain";
import {
  Exchange_AsyncCard,
  Exchange_InfiniteList,
} from "@1.modules/exchange.ui";
import { Card } from "@1.modules/exchange.ui/Card";
import { card } from "@1.ui/react/card/atom";
import { ErrorOccur } from "@1.ui/react/error";
import type {
  QueryObserverSuccessResult,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

//

export default function List() {
  // const { query, setQuery } = useSyncSearchQuery("q");
  // const info = TRPC_React.exchange.find.useInfiniteQuery(
  //   {},
  // ) as UseInfiniteQueryResult<Exchange>;*
  try {
    const info = TRPC_React.exchange.find.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as UseInfiniteQueryResult<Exchange>;

    return (
      <Exchange_InfiniteList info={info}>
        {({ id }) => <Item key={id} id={id} />}
      </Exchange_InfiniteList>
      // <InputSearch {...field} {...props} />;
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Item({ id }: { id: string }) {
  id;
  // const { query, setQuery } = useSyncSearchQuery("q");
  // const info = TRPC_React.exchange.find.useInfiniteQuery(
  //   {},
  // ) as UseInfiniteQueryResult<Exchange>;
  const info = {
    data: {},
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: "success",
  } as QueryObserverSuccessResult<Exchange>;
  const { header } = card();
  console.log({ id });
  return (
    <Exchange_AsyncCard info={info}>
      {({ exchange }) => (
        <Card
          header={<header className={header()}>header</header>}
          body={
            <div>
              <div className="inline-flex"></div>
              <code>{JSON.stringify(exchange, null, 2)}</code>;
              <hr className="my-2" />
              <div className="items-center justify-between text-xs text-[#707070] sm:flex"></div>
            </div>
          }
          footer={<>footer</>}
        />
      )}
    </Exchange_AsyncCard>
  );
}
