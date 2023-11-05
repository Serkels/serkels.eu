// @ts-nocheck

"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { fromClient } from "~/app/api/v1";
import { AnswerRepository, QARepository } from "../../QARepository";
import { QACardContext } from "../QACard/QACard.context";
import { QAResponse } from "./QAResponse";

import { useSession } from "next-auth/react";
import { useSetQueryCacheById } from "~/components/useSetQueryCacheById";

//

export function QACardResponseList() {
  const {
    statefulStatus: [{}],
    question,
  } = useContext(QACardContext);

  const {
    data: comments,
    isLoading,
    isError,
  } = useQueryAnswers(Number(question.id));

  useSetQueryCacheById(comments, ({ id }) => [
    ...AnswerRepository.queryKey,
    Number(id),
  ]);

  //
  if (isLoading)
    return (
      <div className="flex min-h-[150px] items-center">
        <Spinner className="mx-auto my-5" />
      </div>
    );

  if (isError) return <>Epic fail...</>;
  if (!comments) return <>No data O_o</>;

  return (
    <ul>
      {comments
        .sort((a, b) => Date.parse(a.createdAt!) - Date.parse(b.createdAt!))
        .map((comment) => (
          <li className="my-3" key={comment.id}>
            <QAResponse id={comment.id} />
          </li>
        ))}
    </ul>
  );
}

//

function useQueryAnswers(question_id: number) {
  const { data: session } = useSession();
  const api = new AnswerRepository(fromClient, session?.user?.jwt);
  return useQuery({
    enabled: Number.isInteger(question_id),
    queryKey: [
      ...QARepository.queryKey,
      Number(question_id),
      ...AnswerRepository.queryKey,
    ],
    queryFn: async () => api.load(question_id),
    staleTime: Infinity,
  });
}
