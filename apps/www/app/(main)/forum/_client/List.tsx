"use client";

import { TRPC_React } from ":trpc/client";
import type { Question } from "@1.modules/forum.domain";
import { Question_InfiniteList } from "@1.modules/forum.ui/InfiniteList";
import { Question_AsyncCard } from "@1.modules/forum.ui/QuestionCard/AsyncCard";
import { Question_Card } from "@1.modules/forum.ui/QuestionCard/Card";
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
        search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as UseInfiniteQueryResult<{ data: Question[] }>;

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
}
