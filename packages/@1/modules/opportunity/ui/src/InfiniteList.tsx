//

import type { Entity_Schema } from "@1.modules/core/domain";
import { flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { tv } from "tailwind-variants";
import { match, P } from "ts-pattern";

//

export function Opportunity_InfiniteList<T extends Entity_Schema>({
  info,
  children,
}: {
  info: UseInfiniteQueryResult<{ data: T[] }>;
  children: (props: T) => React.ReactNode;
}) {
  const { base, item } = opportunity_grid();
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
        <ul aria-label="List of opportunities" className={base()}>
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

//

function EmptyList() {
  return (
    <figure className="mt-28 text-center">
      <h3 className="text-xl">Aucune opportunité disponible pour le moment</h3>
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

const opportunity_grid = tv({
  base: `
    grid
    grid-flow-row
    grid-cols-1
    gap-8
    px-4
    sm:grid-cols-2
    sm:px-0
    md:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-[repeat(auto-fill,_minmax(0,_260px))]
  `,
  slots: {
    item: "",
  },
});
