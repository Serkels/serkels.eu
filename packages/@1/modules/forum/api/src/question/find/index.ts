//

import type { Prisma } from "@1.infra/database";
import { Forum_Filter } from "@1.modules/forum.domain";
import { procedure } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

export default procedure
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
        OR: [
          {
            owner: {
              profile: {
                name: { contains: search ?? "", mode: "insensitive" },
              },
            },
          },
          { title: { contains: search ?? "", mode: "insensitive" } },
        ],
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
  });
