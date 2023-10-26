//

import { next_auth_procedure, router } from "@1.modules/trpc";

//

const bookmarks_api_router = router({
  //

  exchanges: router({
    find: next_auth_procedure.query(async ({ ctx: { prisma, payload } }) => {
      const { id: owner_id } = payload.profile;
      const data = await prisma.bookmark.findMany({
        where: { owner_id, exchange_id: { not: null } },
        include: {
          // category: true,
          exchange: true,
          owner: true,
        },
      });
      return { data };
    }),
  }),

  //

  opportunities: router({
    find: next_auth_procedure.query(async ({ ctx: { prisma, payload } }) => {
      const { id: owner_id } = payload.profile;
      const bookmarks = await prisma.bookmark.findMany({
        where: { owner_id, opportunity_id: { not: null } },
        include: {
          opportunity: {
            include: { category: true, owner: { include: { profile: true } } },
          },
        },
        orderBy: { created_at: "asc" },
      });

      return { data: bookmarks.map(({ opportunity }) => opportunity!) };
    }),
  }),
});

export default bookmarks_api_router;
export type BookmarksApiRouter = typeof bookmarks_api_router;
