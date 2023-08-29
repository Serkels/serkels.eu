"use client";

import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useSession } from "next-auth/react";
import { P, match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Exchange_List_Controller } from "~/modules/exchange/List.controller";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import { ExchangeCard } from "./ExchangeCard";

//

export function ExchangeList({
  category,
  search,
}: {
  category: string | undefined;
  search: string | undefined;
}) {
  const { data: session } = useSession();
  const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    lists: { useQuery },
  } = new Exchange_List_Controller(repository);

  const query_result = useQuery({
    filter: {
      category,
      search,
    },
    sort: ["createdAt:desc"],
    pagination: { pageSize: 4 },
  });

  //

  return match(query_result)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(
          (list) => list.pages.map((page) => page.data!).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-9">
          {pages
            .map((page) => page.data!)
            .flat()
            .map((exchange) => (
              <li key={exchange.id}>
                <ExchangeCard id={exchange.id!} />
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
