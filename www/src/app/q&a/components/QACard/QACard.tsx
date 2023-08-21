//

import { fromClient } from "@/app/api/v1";
import { ShouldDeleteQuestion } from "@/components/DeleteButton/DeleteButton";
import {
  DeleteButtonContext,
  useDeleteButtonState,
} from "@/components/DeleteButton/DeleteButton.context";
import { ErrorOccur } from "@/components/ErrorOccur";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";
import { QAEditForm } from "../../QAEditForm";
import { AnswerRepository, QARepository } from "../../QARepository";
import { QACardContext, type QACardStatus } from "./QACard.context";
import { QACardFooter } from "./QACardFooter";
import { QACardHeader } from "./QACardHeader";
import { QACardResponseForm } from "./QACardResponseForm";
import { QACardResponses } from "./QACardResponses";

export function QACard({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const statefulStatus = useState<QACardStatus>({
    isDisplayingResponses: false,
    isEditing: false,
    isResponding: false,
    isSubmitting: false,
  });
  const statefulDeleteStatus = useDeleteButtonState();
  const [{ isDeleting }] = statefulDeleteStatus;
  const [{ isDisplayingResponses, isEditing }, setStatus] = statefulStatus;
  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  useRefreshAnswers(Number(id), isDisplayingResponses);

  const { data: question } = useQuery({
    enabled: Number.isInteger(id) && !isDeleting,
    queryKey: [...QARepository.queryKey, Number(id)],
    queryFn: async () => new QARepository(fromClient).loadOne(Number(id)),
    staleTime: Infinity,
  });

  //
  const [deleteing_message, set_deleteing_message] = useState(
    "Suppression de la question",
  );

  const delete_mutation = useDeleteQAMutation(Number(id));
  const on_delete_question = useCallback(async () => {
    await set_deleteing_message(
      (message) =>
        message +
        match(question?.attributes?.answer_count)
          .when(
            (x) => Number(x) === 1,
            () => ` et d'une réponse.`,
          )
          .when(
            (x) => Number(x) > 0,
            (x) => ` et de ${x} réponses.`,
          )
          .otherwise(() => "."),
    );
    await setStatus((state) => ({ ...state, isDeleting: true }));

    await delete_mutation.mutateAsync();

    await Promise.all([
      queryClient.removeQueries([...QARepository.queryKey, Number(id)]),
      queryClient.invalidateQueries([...QARepository.queryKey, "list"]),
    ]);
  }, [question?.id]);

  //

  if (delete_mutation.isLoading) {
    return (
      <div>
        <Spinner className="h-4 w-4" /> {deleteing_message}
      </div>
    );
  }
  if (delete_mutation.isError) {
    return <ErrorOccur error={delete_mutation.error as Error} />;
  }

  if (isDeleting) {
    // && delete_mutation.isSuccess
    return <div>Question supprimée.</div>;
  }

  if (!question) {
    return null;
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-[#00000017] bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]"
      id={id ? String(id) : undefined}
    >
      <DeleteButtonContext.Provider value={statefulDeleteStatus}>
        <QACardContext.Provider
          value={{
            statefulStatus,
            QAResponseFormRef,
            question,
          }}
        >
          <ShouldDeleteQuestion onDelete={on_delete_question} />
          <QACardHeader />
          {isEditing ? (
            <QAEditForm />
          ) : (
            <article>
              <h3 className="my-5 text-xl font-bold">
                {question.attributes?.title}
              </h3>
            </article>
          )}
          <QACardResponses />
          <QACardResponseForm />
          <hr className="my-2" />
          <QACardFooter />
        </QACardContext.Provider>
      </DeleteButtonContext.Provider>
    </div>
  );
}

//

function useRefreshAnswers(question_id: number, shouldRefreshAnswers: boolean) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!shouldRefreshAnswers) return;
    if (Number.isNaN(question_id)) return;

    queryClient.invalidateQueries([
      ...QARepository.queryKey,
      question_id,
      ...AnswerRepository.queryKey,
    ]);
  }, [shouldRefreshAnswers, question_id]);
}

//

function useDeleteQAMutation(id: number) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;

  return useMutation(async () => {
    if (Number.isNaN(id)) throw new Error("Invalid id");
    if (!jwt) throw new Error("Invalid JWT");

    const body = await new QARepository(fromClient, jwt).delete(id);

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [...QARepository.queryKey, id],
      }),
    ]);

    return body;
  });
}
