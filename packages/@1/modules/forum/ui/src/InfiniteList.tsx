//

import type { Entity_Schema } from "@1.modules/core/domain";
import { flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { tv } from "tailwind-variants";
import { match, P } from "ts-pattern";

//

export function Question_InfiniteList<T extends Entity_Schema>({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: T[] }>;
  children: (props: T) => React.ReactNode;
}) {
  const { base, item } = forum_list();
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
        <ul className={base()}>
          {pages
            .map((page) => page.data)
            .flat()
            .map((data) => (
              <li key={data.id} className={item()}>
                {children(data)}
              </li>
            ))}

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
export function Answer_InfiniteList<T extends Entity_Schema>({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: T[] }>;
  children: (props: T) => React.ReactNode;
}) {
  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => (
      <div className="my-9 text-center">
        <Spinner />
      </div>
    ))
    .with(
      {
        status: "success",
        data: P.when(flatten_pages_are_empty),
      },
      () => <p className="my-8 text-center">Pas de réponses</p>,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-4">
          {pages
            .map((page) => page.data)
            .flat()
            .map((data) => (
              <li key={data.id}>{children(data)}</li>
            ))}

          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? (
              <div className="my-9 text-center">
                <Spinner />
              </div>
            ) : null}
          </li>
          <li className="col-span-full mx-auto">
            {hasNextPage ? (
              <Button
                intent="light"
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Plus de réponses
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
    <figure className="mt-28 text-center">
      <h3 className="text-xl">Pas plus de résultats ...</h3>
    </figure>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}

//

const forum_list = tv({
  base: `grid grid-cols-1 gap-9`,
  slots: {
    item: "",
  },
});
