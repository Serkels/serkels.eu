"use client";

import { Share_Button } from ":components/Share_Button";
import { TRPC_React } from ":trpc/client";
import type { Entity_Schema } from "@1.modules/core/domain";
import type { Answer } from "@1.modules/forum.domain";
import { Answer_Card } from "@1.modules/forum.ui/Answer/Card";
import {
  Answer_InfiniteList,
  Question_InfiniteList,
} from "@1.modules/forum.ui/InfiniteList";
import { Question_AsyncCard } from "@1.modules/forum.ui/QuestionCard/AsyncCard";
import { Question_Card } from "@1.modules/forum.ui/QuestionCard/Card";
import { SignUpToAnswer } from "@1.modules/forum.ui/QuestionCard/ResponseButtons";
import { ResponseCount } from "@1.modules/forum.ui/QuestionCard/ResponseCount";
import {
  useAwnsersOutletState,
  useQuestion,
} from "@1.modules/forum.ui/QuestionCard/context";
import { Button } from "@1.ui/react/button";
import { Share } from "@1.ui/react/icons";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  const info = TRPC_React.forum.question.find.useInfiniteQuery(
    {
      category,
      search,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <Question_InfiniteList info={info}>
      {(data) => <Item {...data} />}
    </Question_InfiniteList>
  );
}

function Item(props: Entity_Schema) {
  const info = TRPC_React.forum.question.by_id.useQuery(props.id);

  return (
    <Question_AsyncCard info={info}>
      {(question) => (
        <Question_Card question={question}>
          <Question_Card.Responses>
            <QueryResponses />
          </Question_Card.Responses>
          <Question_Card.Footer>
            <Footer />
          </Question_Card.Footer>
        </Question_Card>
      )}
    </Question_AsyncCard>
  );
}

export function Footer() {
  const question = useQuestion();
  const [, set_awnser_outlet] = useAwnsersOutletState();
  const { status } = useSession();
  const href = `${window.location.origin}/forum?q=${question.title
    .split(" ")
    .join("+")}#${question.id}`;

  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        {status === "authenticated" ? (
          <Button
            intent="light"
            className="-ml-4"
            onPress={() => set_awnser_outlet({ state: "idle" })}
          >
            <ResponseCount />
          </Button>
        ) : (
          <ResponseCount />
        )}
        {status === "authenticated" ? <ResponseButtons /> : <SignUpToAnswer />}
        <Share_Button
          className="-mr-4"
          popover_variant={{ position: "left" }}
          href={href}
        >
          <Share className="h-5 w-5" />
        </Share_Button>
      </div>
    </footer>
  );
}
export function ResponseButtons() {
  return <SignUpToAnswer />;
}

export function QueryResponses() {
  const question = useQuestion();

  const info = TRPC_React.forum.question.answers.find.useInfiniteQuery(
    {
      question_id: question.id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <>
      <div className="relative mb-4 mt-3">
        <hr className="absolute top-0 my-3 w-full" />
        <h5 className="relative inline-block bg-white pr-3 text-sm font-bold uppercase text-Dove_Gray">
          Réponses
        </h5>
      </div>
      <Answer_InfiniteList info={info}>
        {(data) => <AnswerItem {...data} />}
      </Answer_InfiniteList>
    </>
  );
}

function AnswerItem(answer: Answer) {
  // if (1) return <code>{JSON.stringify(answers)}</code>;
  // return <Answer_Card answers={answers}>
  return <Answer_Card answer={answer}></Answer_Card>;
}
