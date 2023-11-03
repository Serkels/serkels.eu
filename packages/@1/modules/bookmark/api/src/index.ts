//

import { Bookmark_Category } from "@1.modules/bookmark.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

const bookmark_type = next_auth_procedure.input(
  z.object({ type: Bookmark_Category }),
);

const bookmarks_api_router = router({
  //

  check: bookmark_type
    .input(z.object({ target_id: z.string() }))
    .query(async ({ ctx: { prisma, payload }, input: { target_id, type } }) => {
      const { id: owner_id } = payload.profile;

      const where = match(type)
        .with(Bookmark_Category.Enum.exchange, () => ({
          exchange_id: target_id,
        }))
        .with(Bookmark_Category.Enum.opportunity, () => ({
          opportunity_id: target_id,
        }))
        .exhaustive();

      const count = await prisma.bookmark.count({
        where: { owner_id, ...where },
      });

      return count === 1;
    }),

  //

  toggle: bookmark_type
    .input(z.object({ target_id: z.string() }))
    .mutation(
      async ({ ctx: { prisma, payload }, input: { target_id, type } }) => {
        const { id: owner_id } = payload.profile;

        const where = match(type)
          .with(Bookmark_Category.Enum.exchange, () => ({
            exchange_id: target_id,
          }))
          .with(Bookmark_Category.Enum.opportunity, () => ({
            opportunity_id: target_id,
          }))

          .exhaustive();

        const bookmark = await prisma.bookmark.findFirst({
          where: { owner_id, ...where },
        });

        if (bookmark) {
          return prisma.bookmark.delete({
            where: { id: bookmark.id },
          });
        }

        return prisma.bookmark.create({
          data: { owner_id, ...where },
        });
      },
    ),

  //

  exchanges: router({
    find: next_auth_procedure.query(async ({ ctx: { prisma, payload } }) => {
      const { id: owner_id } = payload.profile;
      const bookmarks = await prisma.bookmark.findMany({
        where: { owner_id, exchange_id: { not: null } },
        include: {
          exchange: {
            include: {
              category: true,
              return: true,
              owner: { include: { profile: true } },
              deals: { select: { id: true } },
            },
          },
        },
        orderBy: { created_at: "asc" },
      });

      return { data: bookmarks.map(({ exchange }) => exchange!) };
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
