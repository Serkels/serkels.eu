//

import { Forum_Filter } from "@1.modules/forum.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { Prisma } from "@prisma/client";
import { match } from "ts-pattern";
import { z } from "zod";
import { answers_api_router } from "./answers";

const question_api_router = router({
  answers: answers_api_router,
  create: next_auth_procedure
    .input(z.object({ title: z.string(), category: z.string() }))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id: profile_id },
      } = payload;
      const { title, category } = input;

      return prisma.question.create({
        data: {
          title,
          category: { connect: { id: category } },
          owner: { connect: { profile_id } },
        },
      });
    }),

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.question.findUniqueOrThrow({
        where: { id },
        include: {
          answers: { select: { id: true } },
          accepted_answer: { select: { id: true } },
          owner: {
            select: {
              id: true,
              profile: { select: { id: true, name: true, image: true } },
              university: true,
            },
          },
        },
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
        profile_id: z.string().nullable().optional(),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { category, cursor, limit, search, filter, profile_id } = input;

      const narrow = match(filter)
        .with(Forum_Filter.Enum.ALL, (): Prisma.QuestionWhereInput => ({}))
        .with(
          Forum_Filter.Enum.APPROVED,
          (): Prisma.QuestionWhereInput => ({
            NOT: { accepted_answer_id: null },
          }),
        )
        .with(
          Forum_Filter.Enum.AWNSERED,
          (): Prisma.QuestionWhereInput => ({
            NOT: [{ answers: { none: {} } }],
          }),
        )
        .with(
          Forum_Filter.Enum.LAST_QUESTIONS,
          (): Prisma.QuestionWhereInput => ({}),
        )
        .with(
          Forum_Filter.Enum.MINE,
          (): Prisma.QuestionWhereInput =>
            profile_id
              ? {
                  owner: { profile_id },
                }
              : {},
        )
        .with(
          Forum_Filter.Enum.NOT_APPROVED,
          (): Prisma.QuestionWhereInput => ({
            accepted_answer_id: null,
          }),
        )
        .exhaustive();

      const items = await prisma.question.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "desc" },
        take: limit + 1,
        where: {
          title: { contains: search ?? "" },
          ...(category ? { category: { slug: category } } : {}),
          ...narrow,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const next_item = items.pop()!;
        nextCursor = next_item.id;
      }

      return { data: items, nextCursor };
    }),
});

export default question_api_router;
export type ForumApiRouter = typeof question_api_router;
