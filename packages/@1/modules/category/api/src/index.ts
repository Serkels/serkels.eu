//

import { Category_Schema, type Category } from "@1.modules/category.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { wrap } from "@decs/typeschema";
import { CategoryContext } from "@prisma/client";
import { z } from "zod";

//

const category_api_router = router({
  by_id: next_auth_procedure
    .input(wrap(z.string()))
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Category_Schema.parse(
        await prisma.category.findFirstOrThrow({ where: { id } }),
      ) as Category;
    }),

  //

  exchange: procedure.query(async ({ ctx: { prisma } }) => {
    return (await prisma.category.findMany({
      where: { contexts: { has: CategoryContext.EXCHANGE } },
    })) as Category[];
  }),

  //

  opportunity: procedure.query(async ({ ctx: { prisma } }) => {
    return (await prisma.category.findMany({
      where: { contexts: { has: CategoryContext.OPPORTUNITY } },
    })) as Category[];
  }),
});

export default category_api_router;
export type CategoryApiRouter = typeof category_api_router;
