"use client";

import { TRPC_React } from ":trpc/client";
import type { Question } from "@1.modules/forum.domain";
import {
  Question_AsyncCard,
  Question_Card,
  Question_InfiniteList,
} from "@1.modules/forum.ui";
import type { Opportunity } from "@1.modules/opportunity.domain";
import { ErrorOccur } from "@1.ui/react/error";
import type {
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  try {
    const info = TRPC_React.forum.question.find.useInfiniteQuery(
      {
        category,
        search: search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as UseInfiniteQueryResult<{ data: Opportunity[] }>;

    return (
      <Question_InfiniteList info={info}>
        {(data) => <Item {...data} />}
      </Question_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Item(props: Question) {
  try {
    const info = TRPC_React.forum.question.by_id.useQuery(
      props.id,
    ) as UseQueryResult<Question>;

    return (
      <Question_AsyncCard info={info}>
        {({ question }) => <Question_Card {...question} />}
      </Question_AsyncCard>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
  // const { slug } = props;
  // return (
  //   <Link className="h-full" href={`/opportunity/${slug}`}>
  //     <Opoortunity_Card {...props} />
  //   </Link>
  // );
}
