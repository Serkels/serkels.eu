"use client";
import type { components } from "@1/strapi-openapi/v1";
import type { FormikProps } from "formik";
import { createContext, type RefObject } from "react";

//

export const QACardContext = createContext<{
  isSubmitting: boolean;
  setIsSubmitting: (nextValue?: boolean) => void;
  isResponding: boolean;
  setIsResponding: (nextValue?: boolean) => void;
  isDisplayingResponses: boolean;
  setIsDisplayingResponses: (nextValue?: boolean) => void;
  question: components["schemas"]["QuestionListResponseDataItem"];
  QAResponseFormRef: RefObject<FormikProps<{ content: string }>>;
}>({} as any);
