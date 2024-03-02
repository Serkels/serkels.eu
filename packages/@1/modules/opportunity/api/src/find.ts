//

import { Partner_Filter } from "@1.modules/opportunity.domain";
import {
  next_auth_procedure,
  procedure,
  router,
  type inferProcedureInput,
} from "@1.modules/trpc";
import { startOfToday } from "date-fns/startOfToday";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

const public_schema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(12).default(12),
  search: z.string().optional(),
});

const public_procedure = procedure.input(public_schema);

const private_procedure = next_auth_procedure.input(
  public_schema.extend({
    filter: Partner_Filter.default(Partner_Filter.Enum.ALL),
  }),
);

export default router({
  public: public_procedure.query(find_resolver),
  private: private_procedure.query(find_resolver),
});

//

async function find_resolver(
  options:
    | inferProcedureInput<typeof public_procedure>
    | inferProcedureInput<typeof private_procedure>,
) {
  const {
    ctx: { prisma },
    input: { limit, category, cursor, search },
  } = options;

  type OpportunityWhereInput = NonNullable<
    Parameters<typeof prisma.opportunity.findMany>[0]
  >["where"];

  const nerrow = match(options)
    .with(
      { ctx: { payload: P._ } },
      ({
        ctx: {
          payload: {
            profile: { id: profile_id },
          },
        },
        input: { filter },
      }) =>
        match(filter)
          .with(
            Partner_Filter.Enum.MY_OPPORTUNITIES,
            (): OpportunityWhereInput => ({ owner: { profile_id } }),
          )
          .with(Partner_Filter.Enum.ALL, () => ({}))
          .otherwise(() => ({})),
    )
    .otherwise(() => ({}));

  const items = await prisma.opportunity.findMany({
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { expiry_date: "asc" },
    take: limit + 1,
    where: {
      OR: [
        { title: { contains: search ?? "", mode: "insensitive" } },
        { description: { contains: search ?? "", mode: "insensitive" } },
      ],
      expiry_date: { gte: startOfToday() },
      ...(category ? { category: { slug: category } } : {}),
      ...nerrow,
    },
    include: {
      category: true,
      owner: { include: { profile: true } },
    },
  });
  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop()!;
    nextCursor = nextItem.id;
  }
  return { data: items, nextCursor };
}
