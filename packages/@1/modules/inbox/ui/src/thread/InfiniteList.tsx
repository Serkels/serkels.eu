//

import type { Message } from "@1.modules/inbox.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { match, P } from "ts-pattern";

//

export function Thread_InfiniteList({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: Message[] }>;
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
        data: P.when(
          (list) => list.pages.map((page) => page.data).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-5">
          {pages
            .map((page) => page.data)
            .flat()
            .map((item) => children({ id: item.id }))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto">
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

function EmptyList() {
  return (
    <p
      className="
        flex
        h-1/3
        flex-col
        items-center
        justify-center
        text-center
        font-bold
        opacity-50
      "
    >
      Aucune discussion disponible pour le moment
    </p>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}
