"use client";

import { TRPC_React } from ":trpc/client";
import { EmptyList, Loading, flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import Link from "next/link";
import { P, match } from "ts-pattern";

//

export default function Infinite_Exchange_List({
  profile_id,
}: {
  profile_id: string;
}) {
  const info = TRPC_React.exchanges.by_profile.useInfiniteQuery({
    profile_id,
  });

  //

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success", data: P.when(flatten_pages_are_empty) }, () => (
      <EmptyList />
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full overflow-y-auto">
          {pages
            .map((page) => page.data)
            .flat()
            .map((item) => (
              <li key={item.id}>
                <Item exchange_id={item.id} />
              </li>
            ))}
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

function Item({ exchange_id }: { exchange_id: string }) {
  const info = TRPC_React.exchanges.by_id.useQuery(exchange_id);

  if (info.status !== "success") {
    return null;
  }
  const { data: exchange } = info;
  const { id, title } = exchange;
  return (
    <Link href={`/@~/exchanges/inbox/${id}`}>
      <header className="relative">
        <h4 className="mb-3 line-clamp-1 text-lg font-bold" title={title}>
          {title}
        </h4>
      </header>
      {title}
    </Link>
  );
}
