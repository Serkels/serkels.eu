//

import { Bookmark_Category } from "@1.modules/bookmark.domain";
import { router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";
import { bookmark_type_procedure } from "../procedure";

//

export default router({
  check: bookmark_type_procedure
    .input(z.object({ target_id: z.string() }))
    .query(async ({ ctx: { prisma, session }, input: { target_id, type } }) => {
      const { id: owner_id } = session.profile;

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
});
