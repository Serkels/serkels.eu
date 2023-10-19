"use client";

import type { Exchange } from "@1.modules/exchange.domain";
import {
  Exchange_AsyncCard,
  Exchange_InfiniteList,
} from "@1.modules/exchange.ui";
import { Card } from "@1.modules/exchange.ui/Card";
import { card } from "@1.ui/react/card/atom";
import type {
  InfiniteQueryObserverSuccessResult,
  QueryObserverSuccessResult,
} from "@tanstack/react-query";
import { parse } from "date-fns";

//

const mock = [
  {
    id: "0000",
    title: "Visite expo Picasso en couleurs",
    available_places: 3,
    places: 5,
    when: parse("02/09/2023", "P", new Date()),
    description:
      "Dans une licence LEA, vous étudiez deux laus vous inscrivez à une licence où vous apprenez deux langues autres que l’anglais, vous aurez des cours d’anglais en plus). Le but n’est pas seulement de perfectionner communication…",
  },
] as Exchange[];

//

export default function List() {
  // const { query, setQuery } = useSyncSearchQuery("q");
  // const info = TRPC_React.exchange.find.useInfiniteQuery(
  //   {},
  // ) as UseInfiniteQueryResult<Exchange>;
  const info = {
    data: { pages: mock, pageParams: {} },
    error: null,
    isError: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: "success",
  } as InfiniteQueryObserverSuccessResult<Exchange>;

  return (
    <Exchange_InfiniteList info={info}>
      {({ id }) => <Item key={id} id={id} />}
    </Exchange_InfiniteList>
    // <InputSearch {...field} {...props} />;
  );
}

function Item({ id }: { id: string }) {
  id;
  // const { query, setQuery } = useSyncSearchQuery("q");
  // const info = TRPC_React.exchange.find.useInfiniteQuery(
  //   {},
  // ) as UseInfiniteQueryResult<Exchange>;
  const info = {
    data: mock[0],
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
