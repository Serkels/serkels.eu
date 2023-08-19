"use client";

import { fromClient } from "@/app/api/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AnswerRepository } from "../../QARepository";
import { QACardContext } from "../QACard/QACard.context";
import { QAResponse } from "./QAResponse";

import { useSetQueryCacheById } from "@/components/useSetQueryCacheById";

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
    "q&a",
    question.id,
    "answers",
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
  const api = new AnswerRepository(fromClient, question_id);
  return useQuery({
    enabled: Number.isInteger(question_id),
    queryKey: api.queryKey,
    queryFn: async () => api.load(),
    staleTime: Infinity,
  });
}
