//

import type { Prisma } from "@1.infra/database";
import { filter_params_schema } from "@1.modules/exchange.domain/filter_params_schema";
import { next_auth_procedure, with_next_cursor } from "@1.modules/trpc";
import { isAfter } from "date-fns";
import { match } from "ts-pattern";
import { z } from "zod";

//

export const find = next_auth_procedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(10).default(10),
      search: z.string().optional(),
      filter: filter_params_schema.optional(),
    }),
  )
  .query(async ({ input, ctx: { payload, prisma } }) => {
    const { profile } = payload;
    const { cursor, filter, limit, search } = input;

    const { id: student_id } = await prisma.student.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id: profile.id },
    });

    const search_where: Prisma.ExchangeWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            {
              owner: {
                profile: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {};

    const deal_releated_to_me_where: Prisma.DealWhereInput = {
      OR: [
        { participant_id: student_id },
        {
          parent: { owner_id: student_id },
        },
      ],
    };

    const where_not_achived: Prisma.DealWhereInput = {
      NOT: {
        exchange_threads: {
          some: {
            is_archived: true,
            owner_id: student_id,
          },
        },
      },
    };
    const exchange_filter_where = match(filter)
      .with(
        filter_params_schema.enum.IN_PROGRESS,
        (): Prisma.ExchangeWhereInput => ({ is_active: true }),
      )
      .with(
        filter_params_schema.enum.SUCCESS,
        (): Prisma.ExchangeWhereInput => ({ is_active: false }),
      )
      .otherwise((): Prisma.ExchangeWhereInput => ({}));

    const deals = await prisma.deal.findMany({
      ...(cursor
        ? {
            cursor: {
              participant_per_exchange: {
                parent_id: cursor,
                participant_id: student_id,
              },
            },
          }
        : {}),
      orderBy: { updated_at: "desc" },
      select: {
        parent: true,
        exchange_threads: {
          select: {
            last_seen_date: true,
            thread: { select: { updated_at: true } },
          },
          take: 1,
          where: { owner_id: student_id },
          orderBy: { thread: { updated_at: "desc" } },
        },
      },
      take: limit + 1,
      where: {
        AND: [where_not_achived, deal_releated_to_me_where],
        parent: {
          ...search_where,
          ...exchange_filter_where,
        },
      },
      distinct: ["parent_id"],
    });

    const data = deals.map(({ parent, exchange_threads }) => {
      const {
        last_seen_date,
        thread: { updated_at },
      } = exchange_threads[0]!;
      return {
        exchange: parent,
        last_thread_update: updated_at,
        is_unread: isAfter(updated_at, last_seen_date),
      };
    });

    return with_next_cursor(limit, data)((item) => item.exchange.id);
  });
