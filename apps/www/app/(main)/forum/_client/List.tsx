"use client";

import { Share_Button } from ":components/Share_Button";
import { TRPC_React } from ":trpc/client";
import type { Entity_Schema } from "@1.modules/core/domain";
import { Forum_Filter, type Answer } from "@1.modules/forum.domain";
import { Answer_Card } from "@1.modules/forum.ui/Answer/Card";
import { CreateAnswerForm } from "@1.modules/forum.ui/Answer/Form";
import { useAnswer } from "@1.modules/forum.ui/Answer/context";
import {
  Answer_InfiniteList,
  Question_InfiniteList,
} from "@1.modules/forum.ui/InfiniteList";
import { Question_AsyncCard } from "@1.modules/forum.ui/QuestionCard/AsyncCard";
import { Question_Card } from "@1.modules/forum.ui/QuestionCard/Card";
import {
  SignUpToAnswer,
  ToggleOutlet,
} from "@1.modules/forum.ui/QuestionCard/ResponseButtons";
import { ResponseCount } from "@1.modules/forum.ui/QuestionCard/ResponseCount";
import {
  useAwnsersOutletState,
  useNewOutletState,
  useQuestion,
} from "@1.modules/forum.ui/QuestionCard/context";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";
import { Share } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { P, match } from "ts-pattern";

//

export default function List() {
  const { data: session } = useSession();
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter_parsed_return = Forum_Filter.safeParse(search_params.get("f"));
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  useEffect(() => {
    gtag("event", "search", { search_term: search });
  }, [search]);

  const info = TRPC_React.forum.question.find.useInfiniteQuery(
    {
      profile_id: session?.profile.id,
      category,
      search,
      filter,
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
          <Question_Card.Approved_Response>
            <Query_Approved_Response />
          </Question_Card.Approved_Response>
          <Question_Card.NewAnswer>
            <div className="my-6">
              <hr className="my-6" />
              <Mutate_CreateQuestion />
            </div>
          </Question_Card.NewAnswer>
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
  const href_searhparams = new URLSearchParams({ q: question.title });
  const href = `${window.location.origin}/forum?${href_searhparams}#${question.id}`;

  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        <Button
          intent="light"
          className="-ml-4"
          onPress={() => set_awnser_outlet({ state: "idle" })}
        >
          <ResponseCount />
        </Button>
        {status === "authenticated" ? <ToggleOutlet /> : <SignUpToAnswer />}
        <Share_Button
          className="-mr-4"
          popover_variant={{ position: "left" }}
          href={href}
        >
          <Share className="size-5" />
        </Share_Button>
      </div>
    </footer>
  );
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
    <div className="my-6">
      <div className="relative mb-4 mt-3">
        <hr className="absolute top-0 my-3 w-full" />
        <h5 className="relative inline-block bg-white pr-3 text-sm font-bold uppercase text-Dove_Gray">
          Réponses
        </h5>
      </div>
      <Answer_InfiniteList info={info}>
        {(data) => <AnswerItem {...data} />}
      </Answer_InfiniteList>
    </div>
  );
}
export function Query_Approved_Response() {
  const question = useQuestion();

  const info = TRPC_React.forum.question.answers.by_id.useQuery(
    question.accepted_answer?.id!,
    { enabled: Boolean(question.accepted_answer?.id) },
  );
  if (!info.data) return null;

  return (
    <div className="my-6">
      <div className="relative my-6">
        <hr className="absolute top-0 my-3 w-full" />
        <h5 className="relative inline-block bg-white pr-3 text-sm font-bold uppercase text-Dove_Gray">
          Réponse approuvée
        </h5>
      </div>
      <AnswerItem {...info.data} />
    </div>
  );
}

function AnswerItem(initial: Omit<Answer, "accepted_for">) {
  const question = useQuestion();
  const info = TRPC_React.forum.question.answers.by_id.useQuery(initial.id);
  const { data: session } = useSession();
  const is_yours = question.owner.profile.id === session?.profile.id;
  const answer = (info.data ?? initial) as Answer;

  const can_mutate = is_yours;

  return (
    <Answer_Card answer={answer}>
      <Answer_Card.Footer>
        <Answer_Card.Indicator />
        {can_mutate ? <Approve_Mutation /> : null}
      </Answer_Card.Footer>
    </Answer_Card>
  );
}

function Approve_Mutation() {
  const { id: question_id, accepted_answer } = useQuestion();
  const { id: answer_id } = useAnswer();
  const utils = TRPC_React.useUtils();
  const do_approve = TRPC_React.forum.question.answers.approve.useMutation();
  const submit = useCallback(async () => {
    await do_approve.mutateAsync({
      answer_id,
      question_id,
    });

    await Promise.all([
      utils.forum.question.by_id.invalidate(question_id),
      utils.forum.question.answers.by_id.invalidate(answer_id),
      utils.forum.question.answers.by_id.invalidate(accepted_answer?.id),
      utils.forum.question.find.invalidate({}),
    ]);
  }, [question_id, do_approve, answer_id, accepted_answer?.id]);
  if (accepted_answer?.id === answer_id) return null;

  return (
    <div className="ml-12 flex justify-between">
      <Button
        variant={{
          intent: accepted_answer?.id ? "light" : "primary",
          state: accepted_answer?.id ? "ghost" : "outline",
          size: "sm",
        }}
        onPress={submit}
      >
        Approuver
      </Button>
    </div>
  );
}

function Mutate_CreateQuestion() {
  const { id: question_id } = useQuestion();
  const { data: session } = useSession();
  const [, set_awnser_outlet] = useNewOutletState();
  const create_info = TRPC_React.forum.question.answers.create.useMutation();
  const utils = TRPC_React.useUtils();

  const invalidate = useCallback(
    () =>
      Promise.all([
        utils.forum.question.by_id.invalidate(question_id),
        utils.forum.question.answers.find.invalidate({ question_id }),
        utils.forum.question.find.invalidate({}),
      ]),
    [question_id, utils],
  );

  if (!session?.profile) return null;

  return match(create_info)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={new Error(error.message)} />
    ))
    .with({ status: "idle" }, () => (
      <div className="flex space-x-4">
        <Avatar className="h-10" profile={session.profile} />
        <CreateAnswerForm
          onSubmit={async (values) => {
            await create_info.mutateAsync({ ...values, question_id });
            await invalidate();
          }}
        />
      </div>
    ))
    .with({ status: "loading" }, () => (
      <div className="flex justify-center">
        <Spinner className="mx-auto my-6" />
      </div>
    ))
    .with({ status: "success" }, () => {
      setTimeout(() => {
        set_awnser_outlet({ state: "hidden" });
      }, 6_666);
      return (
        <h1 className="py-3 text-center text-lg font-bold text-Chateau_Green">
          Réponse envoyé.
        </h1>
      );
    })
    .exhaustive();
}
