/**
 * bookmark service
 */

import { factories } from "@strapi/strapi";
import { z } from "zod";
import { GetValues, type KoaContext } from "~/types";
import { BOOKMARK_API_CONTENT_ID } from "../content-types/bookmark";

export default factories.createCoreService("api::bookmark.bookmark");
export async function find_owner_bookmarks(owner: number, ctx: KoaContext) {
  const bookmarks = await strapi.entityService.findMany(
    BOOKMARK_API_CONTENT_ID,
    {
      filters: { owner: { id: owner } },
      populate: {
        exchanges: { fields: ["id"] },
        opportunities: { fields: ["id"] },
      },
    },
  );

  //
  const [bookmark] = z
    .array(
      z.object({
        id: z.number(),
        exchanges: z.array(z.object({ id: z.number() })),
        opportunities: z.array(z.object({ id: z.number() })),
      }),
    )
    .length(1, {
      message: `${ctx.state.route.handler} found multiple entry for owner ${owner}`,
    })
    .parse(bookmarks, { path: ["bookmarks"] });

  return bookmark as GetValues<"api::bookmark.bookmark">;
}
