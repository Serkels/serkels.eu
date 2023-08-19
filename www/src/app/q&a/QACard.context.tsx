"use client";

import type { components } from "@1/strapi-openapi/v1";
import type { FormikProps } from "formik";
import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

//

export type QACardStatus = {
  isDeleting: boolean;
  isDisplayingResponses: boolean;
  isEditing: boolean;
  isResponding: boolean;
  isSubmitting: boolean;
  shouldDelete: boolean;
};

export const QACardContext = createContext<{
  statefulStatus: [QACardStatus, Dispatch<SetStateAction<QACardStatus>>];
  question: components["schemas"]["QuestionListResponseDataItem"];
  QAResponseFormRef: RefObject<FormikProps<{ content: string }>>;
}>({} as any);
