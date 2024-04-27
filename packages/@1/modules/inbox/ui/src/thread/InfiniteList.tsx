//

import { Button } from "@1.ui/react/button";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import ContentLoader from "react-content-loader";
import { match, P } from "ts-pattern";
import { Thread_Item } from "./Thread_Item";

//

export function Thread_InfiniteList<T>({
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
      <>
        <Loading />
        <Loading />
        <Loading />
      </>
    ))
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
            .map((item) => children(item))}
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
    <Thread_Item last_update={new Date()}>
      <Thread_Item.Avatar>
        <ContentLoader
          speed={2}
          viewBox="0 0 222 44"
          backgroundColor="#f5f8fa"
          foregroundColor="#ecebeb"
        >
          <rect x="50" y="10" rx="3" ry="3" width="111" height="20" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
      </Thread_Item.Avatar>
      <Thread_Item.Time>
        <ContentLoader
          backgroundColor="#f5f8fa"
          foregroundColor="#ecebeb"
          speed={2}
          viewBox="0 0 50 25"
          width={66}
        >
          <rect x="0" y="0" rx="3" ry="3" width="50" height="10" />
        </ContentLoader>
      </Thread_Item.Time>
      <Thread_Item.Body>
        <ContentLoader
          speed={2}
          viewBox="0 0 200 6"
          backgroundColor="#f5f8fa"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="3" ry="3" width="200" height="6" />
        </ContentLoader>
      </Thread_Item.Body>
    </Thread_Item>
  );
}
