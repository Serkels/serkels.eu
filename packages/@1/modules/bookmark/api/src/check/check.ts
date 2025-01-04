//

import { Bookmark_Category } from "@1.modules/bookmark.domain";
import { maybe_session_procedure, router } from "@1.modules/trpc";
import { to } from "await-to-js";
import { match } from "ts-pattern";
import { z } from "zod";

//

export default router({
  check: maybe_session_procedure
    .input(z.object({ target_id: z.string(), type: Bookmark_Category }))
    .query(async ({ ctx: { prisma, session }, input: { target_id, type } }) => {
      const { id: owner_id } = session?.profile ?? {};

      if (!owner_id) return false;

      const where = match(type)
        .with(Bookmark_Category.Enum.exchange, () => ({
          exchange_id: target_id,
        }))
        .with(Bookmark_Category.Enum.opportunity, () => ({
          opportunity_id: target_id,
        }))
        .exhaustive();

      const [, count] = await to(
        prisma.bookmark.count({
          where: { owner_id, ...where },
        }),
      );

      return count === 1;
    }),
});
