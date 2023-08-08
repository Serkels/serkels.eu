"use client";

import { fromClient } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

//

export function useBookmarksQuery(jwt: string | undefined) {
  const headers = new Headers({ Authorization: `Bearer ${jwt}` });
  return useQuery({
    enabled: Boolean(jwt),
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const {
        response,
        data: body,
        error,
      } = await fromClient.GET("/bookmarks", {
        params: {},
        headers,
      });

      if (error) {
        console.error(error, "from " + response.url);
      }

      return body?.data;
    },
  });
}

export function useBookmarkedOpportunitiesIdsMutation(id: number | undefined) {
  type Body = Omit<components["schemas"]["BookmarkRequest"]["data"], "owner">;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;
  const headers = new Headers({ Authorization: `Bearer ${jwt}` });
  return useMutation(
    async (data: Partial<Body>) => {
      if (!id) throw new Error("Unkown bookmark id");
      if (!jwt) throw new Error("Invalid JWT");
      const {
        response,
        data: body,
        error: errorBody,
      } = await fromClient.PUT("/bookmarks/{id}", {
        params: {
          path: { id },
          query: {
            populate: { opportunities: { fields: ["id"] } },
          },
        } as any,
        body: { data },
        headers,
      });

      if (errorBody) {
        throw new Error(
          [errorBody.error.message, "from " + response.url].join("\n"),
        );
      }

      return body;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(["bookmarks"]);
      },
    },
  );
}
