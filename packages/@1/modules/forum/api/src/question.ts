//

import { Forum_Filter } from "@1.modules/forum.domain";
import { procedure, router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

const question_api_router = router({
  create: procedure
    .input(z.object({ title: z.string(), category: z.string() }))
    .mutation(async ({}) => {
      console.log({ user: null });
      return {};
    }),

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.question.findUniqueOrThrow({
        where: { id },
        include: { category: true, owner: { include: { profile: true } } },
      });
    }),

  find: procedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        filter: Forum_Filter.default(Forum_Filter.Enum.ALL),
        limit: z.number().min(1).max(10).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { category, cursor, limit, search, filter } = input;
      type QuestionWhere = NonNullable<
        Parameters<typeof prisma.question.findMany>[0]
      >["where"];
      const nerrow = match(filter)
        .with(Forum_Filter.Enum.ALL, (): QuestionWhere => ({}))
        .with(Forum_Filter.Enum.AWNSERED, (): QuestionWhere => ({}))
        .with(Forum_Filter.Enum.FREQUENTLY_ASKED, (): QuestionWhere => ({}))
        .with(Forum_Filter.Enum.LASTEST_ANSWERS, (): QuestionWhere => ({}))
        .with(Forum_Filter.Enum.LAST_QUESTIONS, (): QuestionWhere => ({}))
        .with(Forum_Filter.Enum.MINE, (): QuestionWhere => ({}))
        .exhaustive();

      const items = await prisma.question.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "asc" },
        take: limit + 1,
        where: {
          title: { contains: search ?? "" },
          ...(category ? { category: { slug: category } } : {}),
          ...nerrow,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { data: items, nextCursor };
    }),
});

export default question_api_router;
export type ForumApiRouter = typeof question_api_router;
