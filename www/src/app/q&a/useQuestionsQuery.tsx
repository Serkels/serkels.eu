//

import { fromClient } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useQuestionMutation() {
  const { data: session, update } = useSession();
  const jwt = session?.user?.jwt;
  const headers = new Headers({ Authorization: `Bearer ${jwt}` });
  return useMutation(
    async (data: components["schemas"]["QuestionRequest"]["data"]) => {
      if (!jwt) throw new Error("Invalid JWT");
      const {
        response,
        data: body,
        error: errorBody,
      } = await fromClient.POST("/questions", {
        body: {
          data: { ...data, owner: String(session.user?.id) },
        },
        headers,
        params: {
          query: {
            populate: {
              opportunity_category: { fields: ["name"] },
              owner: { fields: ["email"] },
            },
          },
        },
      });

      if (errorBody) {
        throw new Error(
          [errorBody.error.message, "from " + response.url].join("\n"),
        );
      }

      await update();

      return body;
    },
  );
}
