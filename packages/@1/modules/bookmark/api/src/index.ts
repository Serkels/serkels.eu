//

import { Bookmark_Category } from "@1.modules/bookmark.domain";
import { mergeRouters, router, session_procedure } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";
import { check_api_router } from "./check";
import { bookmark_type_procedure } from "./procedure";

//

const bookmarks_api_router = router({
  //

  toggle: bookmark_type_procedure
    .input(z.object({ target_id: z.string() }))
    .mutation(
      async ({ ctx: { prisma, session }, input: { target_id, type } }) => {
        const { id: owner_id } = session.profile;

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
    find: session_procedure.query(async ({ ctx: { prisma, session } }) => {
      const { id: owner_id } = session.profile;
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
    find: session_procedure.query(async ({ ctx: { prisma, session } }) => {
      const { id: owner_id } = session.profile;
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

export default mergeRouters(check_api_router, bookmarks_api_router);
