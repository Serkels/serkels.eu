//

import { deal_state_action_schema } from "@1.modules.exchange/domain";
import {
  StrapiPagination_Schema,
  type TRPCOpenAPIContext,
} from "@1/strapi-trpc-router";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

//

const { router, procedure } = initTRPC.context<TRPCOpenAPIContext>().create();

//

export const exchange_router = router({
  deal: router({
    status: procedure
      .input(
        z.object({
          deal_id: z.number(),
          exchange_id: z.number(),
          action: deal_state_action_schema,
        }),
      )
      .query(async ({ ctx: { headers, openapi }, input }) => {
        const {
          client: { PATCH },
        } = openapi;

        const { deal_id, exchange_id, action } = input;

        const data = await openapi.fetch(
          PATCH("/exchanges/{exchange_id}/deals/{deal_id}/status/{action}", {
            headers,
            params: {
              path: { action, exchange_id, deal_id },
            },
          }),
        );

        return data;
      }),
  }),
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
