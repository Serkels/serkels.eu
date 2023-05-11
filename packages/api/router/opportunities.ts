//

import { fetcher } from "..";
import { createTRPCRouter, publicProcedure } from "../trpc";

//

export const opportunitiesRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await fetcher({ baseUrl: ctx.strapi_api }).get(
      "/opportunities",
      {
        params: { query: {} },
      }
    );
    if (!data && error) {
      throw error;
    }
    const { data: opportunities, meta } = data;

    return opportunities!.map(({ id, attributes }) => ({
      id,
      title: attributes?.title,
      description: attributes?.description,
      slug: attributes?.slug,
      createdAt: attributes?.createdAt,
      updatedAt: attributes?.updatedAt,
    }));
  }),
});
