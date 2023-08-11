"use client";

import type { components } from "@1/strapi-openapi/v1";
import type { FormikProps } from "formik";
import { useRef, useState } from "react";
import { useToggle } from "react-use";
import { QACardBody } from "./QACardBody";
import { QACardContext, type QACardStatus } from "./QACardContext";
import { QACardFooter } from "./QACardFooter";
import { QACardResponseForm } from "./QACardResponseForm";
import { QACardResponses } from "./QACardResponses";

export function QACard(
  question: components["schemas"]["QuestionListResponseDataItem"],
) {
  const [isResponding, setIsResponding] = useToggle(false);
  const [isSubmitting, setIsSubmitting] = useToggle(false);
  const [isDisplayingResponses, setIsDisplayingResponses] = useToggle(false);
  const statefulStatus = useState<QACardStatus>({
    isResponding: false,
    isSubmitting: false,
    isDisplayingResponses: false,
  });
  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  //

  return (
    <div
      className="overflow-hidden rounded-xl border border-[#00000017] bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]"
      id={question.id ? String(question.id) : undefined}
    >
      <QACardContext.Provider
        value={{
          statefulStatus,
          isDisplayingResponses,
          isResponding,
          isSubmitting,
          QAResponseFormRef,
          question,
          setIsDisplayingResponses,
          setIsResponding,
          setIsSubmitting,
        }}
      >
        <QACardBody />
        <QACardResponses />
        <QACardResponseForm />
        <hr className="my-2" />
        <QACardFooter />
      </QACardContext.Provider>
    </div>
  );
}
