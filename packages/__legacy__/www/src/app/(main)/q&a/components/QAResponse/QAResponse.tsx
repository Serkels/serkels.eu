//

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useRef, useState } from "react";
import { fromClient } from "~/app/api/v1";
import { ShouldDeleteQuestion } from "~/components/DeleteButton/DeleteButton";
import {
  DeleteButtonContext,
  useDeleteButtonState,
} from "~/components/DeleteButton/DeleteButton.context";
import { AnswerRepository, QARepository } from "../../QARepository";
import { QACardContext } from "../QACard/QACard.context";
import { QAResponseContext, type QAResponseStatus } from "./QAResponse.context";
import { QAResponseBody } from "./QAResponseBody";
import { QAResponseHeader } from "./QAResponseHeader";

function useQAResponseProps(id: number) {
  const {
    question: { id: question_id },
  } = useContext(QACardContext);

  const statefulStatus = useState<QAResponseStatus>({
    isEditing: false,
    isSubmitting: false,
  });
  const [, setStatus] = statefulStatus;

  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  const statefulDeleteStatus = useDeleteButtonState();
  const { data: response } = useQueryResponse([
    Number(question_id),
    statefulDeleteStatus[0].isDeleting ? NaN : id,
  ]);

  const delete_mutation = useDeleteAnswerMutation(Number(id));
  const queryClient = useQueryClient();
  const on_delete_question = useCallback(async () => {
    await setStatus((state) => ({ ...state, isDeleting: true }));

    await Promise.all([delete_mutation.mutateAsync()]);
    await Promise.all([
      queryClient.removeQueries([...AnswerRepository.queryKey, id]),
      queryClient.invalidateQueries([...QARepository.queryKey, question_id]),
    ]);
  }, [response?.id]);

  return {
    response,
    statefulStatus,
    QAResponseFormRef,
    statefulDeleteStatus,
    on_delete_question,
  };
}

export function QAResponse({ id }: { id: number }) {
  const {
    response,
    statefulStatus,
    QAResponseFormRef,
    statefulDeleteStatus,
    on_delete_question,
  } = useQAResponseProps(id);
  //

  if (!response) {
    return null;
  }

  return (
    <QAResponseContext.Provider
      value={{ statefulStatus, QAResponseFormRef, response }}
    >
      <DeleteButtonContext.Provider value={statefulDeleteStatus}>
        <ShouldDeleteQuestion onDelete={on_delete_question} />
        <header className=" flex justify-between"></header>
        <QAResponseHeader />
        <QAResponseBody />
      </DeleteButtonContext.Provider>
    </QAResponseContext.Provider>
  );
}

//

function useQueryResponse([question_id, id]: [number, number]) {
  const { data: session } = useSession();
  const api = new AnswerRepository(fromClient, session?.user?.jwt);

  return useQuery({
    enabled: Number.isInteger(question_id) && Number.isInteger(id),
    queryKey: [...AnswerRepository.queryKey, id],
    queryFn: async () => api.loadOne(Number(id)),
    staleTime: Infinity,
  });
}

function useDeleteAnswerMutation(id: number) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;

  return useMutation(async () => {
    if (Number.isNaN(id)) throw new Error("Invalid id");
    if (!jwt) throw new Error("Invalid JWT");

    const body = await new AnswerRepository(fromClient, jwt).delete(id);

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [...AnswerRepository.queryKey, id],
      }),
    ]);

    return body;
  });
}
