//

import { fromClient } from "@/app/api/v1";
import { useQuery } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useContext, useRef, useState } from "react";
import { AnswerRepository } from "../../QARepository";
import { QACardContext } from "../QACard/QACard.context";
import { QAResponseContext, type QAResponseStatus } from "./QAResponse.context";
import { QAResponseBody } from "./QAResponseBody";
import { QAResponseHeader } from "./QAResponseHeader";

export function QAResponse({ id }: { id: number }) {
  const {
    question: { id: question_id },
  } = useContext(QACardContext);
  const statefulStatus = useState<QAResponseStatus>({
    isDeleting: false,
    isEditing: false,
    isSubmitting: false,
    shouldDelete: false,
  });
  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  const { data: response } = useQueryResponse([Number(question_id), id]);

  //

  if (!response) {
    return null;
  }

  return (
    <QAResponseContext.Provider
      value={{ statefulStatus, QAResponseFormRef, response }}
    >
      <header className=" flex justify-between"></header>
      <QAResponseHeader />
      <QAResponseBody />
    </QAResponseContext.Provider>
  );
}

//

function useQueryResponse([question_id, id]: [number, number]) {
  const { data: session } = useSession();
  const api = new AnswerRepository(fromClient, session?.user?.jwt);

  return useQuery({
    enabled: Number.isInteger(question_id) && Number.isInteger(id),
    queryKey: [...api.queryKey, id],
    queryFn: async () => api.loadOne(Number(id)),
    staleTime: Infinity,
  });
}
