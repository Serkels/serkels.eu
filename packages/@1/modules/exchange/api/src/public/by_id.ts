//

import { Deal_Status_Schema } from "@1.modules/exchange.domain";
import { maybe_next_auth_procedure } from "@1.modules/trpc/src/trpc";
import { z } from "zod";

//

export default maybe_next_auth_procedure
  .input(z.string())
  .use(async ({ ctx: { payload, prisma }, input: id, next }) => {
    const profile_id = payload.profile?.id;
    const get_exchange_by_id = prisma.exchange.findUniqueOrThrow({
      include: {
        category: true,
        return: true,
        owner: { include: { profile: true } },
        deals: {
          select: {
            id: true,
            status: true,
            participant: { select: { profile: { select: { id: true } } } },
          },
          where: { status: Deal_Status_Schema.Enum.APPROVED },
        },
      },
      where: { id },
    });

    /**
     * Ensure to remove participant profile information for
     */
    const sanitize = async (exchange: Awaited<typeof get_exchange_by_id>) => {
      const { deals } = exchange;
      return {
        ...exchange,
        deals: deals.map((deal) => ({
          ...deal,
          participant:
            deal.participant.profile.id === profile_id
              ? deal.participant
              : undefined,
        })),
      };
    };

    //

    return next({
      ctx: { get_exchange_by_id, sanitize },
    });
  })
  .query(async ({ ctx: { get_exchange_by_id, sanitize } }) => {
    const exchange = await get_exchange_by_id;
    return sanitize(exchange);
  });
