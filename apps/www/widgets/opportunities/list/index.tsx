"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import { Card } from ":widgets/opportunities/card";
import type { RouterOutput } from "@1.infra/trpc";
import { Button } from "@1.ui/react/button";
import type { InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { match, P } from "ts-pattern";

//

type FindOpportunity = RouterOutput["opportunity"]["find"]["public"];

//

export default function AsyncListInfinite(props: { category?: string }) {
  const search_params = useSearchParams();
  const category = props.category ?? search_params.get("category") ?? undefined;

  const query_info = TRPC_React.opportunity.find.public.useInfiniteQuery(
    { category, limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, (success_info) => (
      <List query_info={success_info} />
    ))
    .exhaustive();
}

function UncategoriesList() {
  const query_info = TRPC_React.opportunity.find.public.useInfiniteQuery(
    { limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, (success_info) => (
      <List query_info={success_info} />
    ))
    .exhaustive();
}

function List({
  query_info,
}: {
  query_info: InfiniteQueryObserverSuccessResult<FindOpportunity, unknown>;
}) {
  const { data, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } =
    query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  if (flatten_pages.length === 0) {
    return <UncategoriesList />;
  }

  return (
    <>
      <ul className="space-y-6">
        {flatten_pages.map((opportunity) => (
          <li key={opportunity.id}>
            <Card opportunity={opportunity} />
          </li>
        ))}
      </ul>
      {match({ isFetchingPreviousPage, hasPreviousPage })
        .with({ isFetchingPreviousPage: true }, () => <Loading_Placeholder />)
        .with({ hasPreviousPage: true }, () => (
          <LoadMore onClick={fetchPreviousPage} />
        ))
        .otherwise(() => null)}
    </>
  );
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto my-6 block"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus d'opportunité.
    </Button>
  );
}
