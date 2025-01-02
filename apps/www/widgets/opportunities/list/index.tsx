"use client";

import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import { Card } from ":widgets/opportunities/card";
import type { RouterOutput } from "@1.infra/trpc";
import { Button } from "@1.ui/react/button";
import type { InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { motion, type MotionProps } from "motion/react";
import { useSearchParams } from "next/navigation";
import { match, P } from "ts-pattern";

//

type FindOpportunity = RouterOutput["opportunity"]["find"];

//

export default function AsyncListInfinite(props: {
  category?: string;
  exclude_ids?: string[];
}) {
  const search_params = useSearchParams();
  const category = props.category ?? search_params.get("category") ?? undefined;
  const exclude_ids = props.exclude_ids ?? [];

  const query_with_category_info = TRPC_React.opportunity.find.useInfiniteQuery(
    { category, limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.next_cursor,
    },
  );
  const nothing_found_with_category =
    query_with_category_info.isFetched &&
    query_with_category_info.data &&
    query_with_category_info.data.pages
      .map(({ data }) => data)
      .flat()
      .filter(({ id }) => !exclude_ids.includes(id)).length === 0;

  const query_without_category_info =
    TRPC_React.opportunity.find.useInfiniteQuery(
      { limit: 5 },
      {
        getNextPageParam: (lastPage) => lastPage.next_cursor,
        enabled: nothing_found_with_category,
      },
    );

  const query_info = nothing_found_with_category
    ? query_without_category_info
    : query_with_category_info;

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => {
      return <Loading_Placeholder />;
    })
    .with({ status: "success" }, (success_info) => (
      <List
        category={nothing_found_with_category ? "all" : category}
        exclude_ids={exclude_ids}
        query_info={success_info}
      />
    ))
    .exhaustive();
}

function List({
  category,
  exclude_ids,
  query_info,
}: {
  category?: string;
  exclude_ids: string[];
  query_info: InfiniteQueryObserverSuccessResult<FindOpportunity, unknown>;
}) {
  const { data, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } =
    query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat()
    .filter(({ id }) => !exclude_ids.includes(id));

  if (flatten_pages.length === 0) {
    return <p className="my-8 text-center">Pas de résultats ...</p>;
  }

  return (
    <>
      <motion.ul
        key={category}
        className="space-y-6 md:mx-auto md:max-w-[333px]"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {flatten_pages.map((opportunity) => (
          <AppearMotionLi key={opportunity.id}>
            <Card opportunity={opportunity} />
          </AppearMotionLi>
        ))}
      </motion.ul>
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
function AppearMotionLi({ children, ...motion_props }: MotionProps) {
  return (
    <motion.li
      layout="position"
      transition={{ ease: "easeInOut", duration: 0.75 }}
      variants={{
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0 },
      }}
      {...motion_props}
    >
      {children}
    </motion.li>
  );
}
