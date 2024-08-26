//

import type { Exchange } from "@1.modules/exchange.domain";
import { flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { match, P } from "ts-pattern";

export function Exchange_InfiniteList({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: Exchange[] }>;
  children: (props: { id: string }) => React.ReactNode;
}) {
  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(flatten_pages_are_empty),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-9">
          {pages
            .map((page) => page.data)
            .flat()
            .map((exchange) => children({ id: exchange.id }))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto pb-8">
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

//

function EmptyList() {
  return (
    <h5 className="py-5 text-center font-bold">Pas plus de résultats ...</h5>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}
