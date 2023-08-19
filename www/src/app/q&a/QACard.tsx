"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";
import { fromClient } from "../api/v1";
import { QACardContext, type QACardStatus } from "./QACard.context";
import { QACardFooter } from "./QACardFooter";
import { QACardHeader } from "./QACardHeader";
import { QACardResponseForm } from "./QACardResponseForm";
import { QACardResponses } from "./QACardResponses";
import { QAEditForm } from "./QAEditForm";
import { QAFormErrorOccur } from "./QAFormErrorOccur";
import { QARepository } from "./QARepository";

export function QACard({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const statefulStatus = useState<QACardStatus>({
    isDeleting: false,
    isDisplayingResponses: false,
    isEditing: false,
    isResponding: false,
    isSubmitting: false,
    shouldDelete: false,
  });
  const [
    { isDisplayingResponses, isEditing, isDeleting, shouldDelete },
    setStatus,
  ] = statefulStatus;
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
  useShouldDeleteQuestion(Number(id), shouldDelete, async () => {
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

    await Promise.all([
      queryClient.removeQueries([...QARepository.queryKey, Number(id)]),
      delete_mutation.mutateAsync(),
    ]);
  });

  useEffect(() => {
    setTimeout(async () => {
      queryClient.invalidateQueries({
        queryKey: QARepository.queryKey,
      });
    }, 2_222);
  }, [isDeleting && delete_mutation.isSuccess]);

  //

  if (delete_mutation.isLoading) {
    return (
      <div>
        <Spinner className="h-4 w-4" /> {deleteing_message}
      </div>
    );
  }
  if (delete_mutation.isError) {
    return <QAFormErrorOccur error={delete_mutation.error as Error} />;
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
      <QACardContext.Provider
        value={{
          statefulStatus,
          QAResponseFormRef,
          question,
        }}
      >
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
      "awnsers",
    ]);
  }, [shouldRefreshAnswers, question_id]);
}

function useShouldDeleteQuestion(
  question_id: number,
  shouldDeleteQuestion: boolean,
  deleteCallback: () => Promise<void> | void,
) {
  useEffect(() => {
    if (Number.isNaN(question_id)) return;
    if (!shouldDeleteQuestion) return;

    if (
      !window.confirm("Êtes vous sur de vouloir supprimer cette question ?")
    ) {
      return;
    }

    deleteCallback();
  }, [shouldDeleteQuestion, question_id]);
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
