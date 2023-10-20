"use client";

import { TRPC_React } from ":trpc/client";
import {
  Exchange_AsyncCard,
  Exchange_InfiniteList,
} from "@1.modules/exchange.ui";
import { Card } from "@1.modules/exchange.ui/Card";
import { card } from "@1.ui/react/card/atom";
import { ErrorOccur } from "@1.ui/react/error";
import type { ComponentProps } from "react";

//

export default function List() {
  try {
    const info = TRPC_React.exchange.find.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // select({ pages, pageParams }) {
        //   return { pages: pages.map((page) => page.data), pageParams };
        // },
      },
    ) as ComponentProps<typeof Exchange_InfiniteList>["info"];

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
  const { header } = card();
  try {
    const info = TRPC_React.exchange.by_id.useQuery(id) as ComponentProps<
      typeof Exchange_AsyncCard
    >["info"];
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
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
