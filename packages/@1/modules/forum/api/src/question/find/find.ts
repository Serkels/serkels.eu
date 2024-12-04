//

import type { Prisma } from "@1.infra/database";
import { Forum_Filter } from "@1.modules/forum.domain";
import {
  maybe_session_procedure,
  router,
  with_next_cursor,
} from "@1.modules/trpc";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

const where_category_input = (category: string | undefined) =>
  match(category)
    .with(
      P.string,
      (value): Prisma.QuestionWhereInput => ({
        category: { slug: value },
      }),
    )
    .otherwise(() => ({}));

const where_filter_input = (
  filter: z.infer<typeof Forum_Filter>,
  profile_id?: string | undefined,
) =>
  match({ filter, profile_id })
    .with(
      { filter: Forum_Filter.Enum.ALL },
      { filter: Forum_Filter.Enum.MINE, profile_id: undefined },
      (): Prisma.QuestionWhereInput => ({}),
    )
    .with(
      { filter: Forum_Filter.Enum.APPROVED },
      (): Prisma.QuestionWhereInput => ({
        NOT: { accepted_answer_id: null },
      }),
    )
    .with(
      { filter: Forum_Filter.Enum.AWNSERED },
      (): Prisma.QuestionWhereInput => ({
        NOT: [{ answers: { none: {} } }],
      }),
    )
    .with(
      { filter: Forum_Filter.Enum.LAST_QUESTIONS },
      (): Prisma.QuestionWhereInput => ({}),
    )
    .with(
      { filter: Forum_Filter.Enum.MINE, profile_id: P.string },
      ({ profile_id }): Prisma.QuestionWhereInput => ({
        owner: { profile_id },
      }),
    )
    .with(
      { filter: Forum_Filter.Enum.NOT_APPROVED },
      (): Prisma.QuestionWhereInput => ({
        accepted_answer_id: null,
      }),
    )
    .exhaustive();

const where_not_in_profile_blacklist_input = (profile_id: string | undefined) =>
  match(profile_id)
    .with(
      P.string,
      (value): Prisma.QuestionWhereInput => ({
        AND: [
          {
            owner: { profile: { blacklist: { none: { profile_id: value } } } },
          },
          {
            owner: {
              profile: { blacklisted_by: { none: { owner_id: value } } },
            },
          },
        ],
      }),
    )
    .otherwise(() => ({}));

const where_search_input = (search: string | undefined) =>
  match(search)
    .with(
      P.string,
      (value): Prisma.QuestionWhereInput => ({
        OR: [
          {
            owner: {
              profile: {
                name: { contains: value, mode: "insensitive" },
              },
            },
          },
          { title: { contains: value, mode: "insensitive" } },
        ],
      }),
    )
    .otherwise(() => ({}));

//

const input_schema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  filter: Forum_Filter.default(Forum_Filter.Enum.ALL),
  limit: z.number().min(1).max(10).default(10),
  search: z.string().optional(),
});

export default router({
  find: maybe_session_procedure
    .input(input_schema)
    .query(async ({ input, ctx: { session, prisma } }) => {
      const profile_id = session?.profile?.id;
      const { category, cursor, limit, search, filter } = input;

      const where_category = where_category_input(category);
      const where_filter = where_filter_input(filter, profile_id);
      const where_not_in_profile_blacklist =
        where_not_in_profile_blacklist_input(profile_id);
      const where_search = where_search_input(search);

      const items = await prisma.question.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "desc" },
        take: limit + 1,
        where: {
          AND: [
            where_category,
            where_filter,
            where_not_in_profile_blacklist,
            where_search,
          ],
        },
      });

      return with_next_cursor(limit, items)((item) => item.id);
    }),
});
