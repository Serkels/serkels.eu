"use client";

import type { Opportunity } from "@1/modules/opportunity/domain";
import { Spinner } from "@1/ui/components/Spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { P, match } from "ts-pattern";
import {
  Opportunity_Grid,
  Opportunity_Item,
} from "~/app/(main)/opportunity/Opportunity_Item";
import { useInject } from "~/core/react";
import { Get_Opportunity_Bookmarks_UseCase } from "~/modules/bookmarks/application/get_opportunity_bookmarks.use-case";

//

export function Bookmark_OpportunityList() {
  const info = useInject(Get_Opportunity_Bookmarks_UseCase).execute({
    pageSize: 12,
  });

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => <Opportunity_MainGrid info={info} />)
    .exhaustive();
}

function Opportunity_MainGrid({
  info,
}: {
  info: UseInfiniteQueryResult<Opportunity, unknown>;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = info;
  const opportunities = data?.pages.map((data) => data) ?? [];

  return match(opportunities)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <Opportunity_Grid>
        {list.map((opportunity) => (
          <li key={opportunity.get("id")}>
            <Opportunity_Item opportunity={opportunity} />
          </li>
        ))}
        <li className="col-span-full mx-auto">
          {isFetchingNextPage ? <Loading /> : null}
        </li>
        <li className="col-span-full mx-auto">
          {hasNextPage ? (
            <button
              className="
              rounded-md
              bg-gray-600
              px-3
              py-1.5
              text-sm
              font-semibold
              leading-6
              text-white
              shadow-sm
              hover:bg-gray-500
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-gray-600
            "
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Charger plus
            </button>
          ) : null}
        </li>
      </Opportunity_Grid>
    ));
}

function Loading() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <Spinner />
    </figure>
  );
}

function EmptyList() {
  return (
    <figure className="mt-28 min-h-screen text-center">
      <h3 className="text-xl">Aucune opportunité disponible pour le moment</h3>
    </figure>
  );
}
