//

import {
  StrapiPagination_Schema,
  type TRPCOpenAPIContext,
} from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

//

const { router, procedure } = initTRPC.context<TRPCOpenAPIContext>().create();

//

export const exchange_router = router({
  all: procedure
    .input(
      StrapiPagination_Schema.augment({
        cursor: z.number().nullish(),
        filters: z
          .object({
            category: z.string().optional(),
            title: z.string().optional(),
          })
          .default({}),
      }),
    )
    .query(async ({ ctx: { headers, openapi }, input }) => {
      const {
        client: { GET },
      } = openapi;

      const pagination = {
        page: input.cursor,
        pageSize: input.pagination.pageSize,
      };

      const filters = {
        $and: [
          {
            category: {
              slug: { $eq: input.filters?.category },
            },
          },
        ],
        $or: [
          {
            title: {
              $containsi: input.filters?.title,
            },
          },
        ],
      };

      const data = await openapi.fetch(
        GET("/exchanges", {
          headers,
          params: {
            query: {
              filters,
              ...({ pagination } as any),
              sort: ["createdAt:desc"],
            },
          },
        }),
      );

      return data;
    }),
});
