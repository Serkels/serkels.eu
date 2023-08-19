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

export type QAResponseStatus = {
  isDeleting: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  shouldDelete: boolean;
};

export const QAResponseContext = createContext<{
  statefulStatus: [
    QAResponseStatus,
    Dispatch<SetStateAction<QAResponseStatus>>,
  ];
  response: components["schemas"]["CommentsComment"];
  QAResponseFormRef: RefObject<FormikProps<{ content: string }>>;
}>({} as any);
