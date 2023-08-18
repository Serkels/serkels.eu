"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { fromClient } from "../api/v1";
import { QACardContext, type QACardStatus } from "./QACard.context";
import { QACardFooter } from "./QACardFooter";
import { QACardHeader } from "./QACardHeader";
import { QACardResponseForm } from "./QACardResponseForm";
import { QACardResponses } from "./QACardResponses";
import { QARepository } from "./QARepository";

export function QACard({ id }: { id: number }) {
  const statefulStatus = useState<QACardStatus>({
    isResponding: false,
    isSubmitting: false,
    isDisplayingResponses: false,
  });
  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  useRefreshAnswers(Number(id), statefulStatus[0].isDisplayingResponses);

  const { data: question } = useQuery({
    enabled: Number.isInteger(id),
    queryKey: [...QARepository.queryKey, Number(id)],
    queryFn: async () => new QARepository(fromClient).loadOne(Number(id)),
    staleTime: Infinity,
  });

  if (!question) {
    return null;
  }

  //

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
        <article>
          <h3 className="my-5 text-xl font-bold">
            {question.attributes?.title}
          </h3>
        </article>
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
    queryClient.invalidateQueries([
      ...QARepository.queryKey,
      question_id,
      "awnsers",
    ]);
  }, [shouldRefreshAnswers]);
}
