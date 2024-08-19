//

import { Category_Schema, type Category } from "@1.modules/category.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { CategoryContext } from "@prisma/client";
import { wrap } from "@typeschema/zod";
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
      where: {
        OR: [{ context: CategoryContext.EXCHANGE }, { context: null }],
      },
      orderBy: { rank: "desc" },
    })) as Category[];
  }),

  //

  forum: procedure.query(async ({ ctx: { prisma } }) => {
    return (await prisma.category.findMany({
      where: { OR: [{ context: CategoryContext.FORUM }, { context: null }] },
      orderBy: { rank: "desc" },
    })) as Category[];
  }),

  //

  opportunity: procedure.query(async ({ ctx: { prisma } }) => {
    return (await prisma.category.findMany({
      where: {
        OR: [{ context: CategoryContext.OPPORTUNITY }, { context: null }],
      },
      orderBy: { rank: "desc" },
    })) as Category[];
  }),

  //

  // update: next_auth_procedure.input(Category_Schema).mutation(async ({
  //   input,
  //   ctx: { prisma, payload },
  // }) => {
  //  if (payload.profile.role !== PROFILE_ROLES.Enum.ADMIN) {
  //     return Error
  //   }

  //   return await prisma.category.update({
  //     where: { id: input.id },
  //     data: {
  //       name: input.name,
  //       context: input.context,
  //       rank: input.rank,
  //     },
  //   });
  // }),
});

export default category_api_router;
export type CategoryApiRouter = typeof category_api_router;
