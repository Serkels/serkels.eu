//

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
  isEditing: boolean;
  isSubmitting: boolean;
};

export const QAResponseContext = createContext<{
  statefulStatus: [
    QAResponseStatus,
    Dispatch<SetStateAction<QAResponseStatus>>,
  ];
  response: components["schemas"]["CommentsComment"];
  QAResponseFormRef: RefObject<FormikProps<{ content: string }>>;
}>({} as any);
