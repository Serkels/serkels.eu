//

import type { components } from "@1/strapi-openapi/v1";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fromClient } from "~/app/api/v1";

//

export function useUserMutation() {
  const { data: session, update } = useSession();
  const jwt = session?.user?.jwt;
  const headers = new Headers({ Authorization: `Bearer ${jwt}` });
  return useMutation(
    async (
      data: Partial<components["schemas"]["UserProfileRequest"]["data"]>,
    ) => {
      if (!jwt) throw new Error("Invalid JWT");
      const {
        response,
        data: body,
        error: errorBody,
      } = await fromClient.PUT("/user-profiles/me", {
        body: {
          data: data as components["schemas"]["UserProfileRequest"]["data"],
        },
        headers,
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
