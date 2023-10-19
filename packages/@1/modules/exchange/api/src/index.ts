//

import { Exchange_Schema, type Exchange } from "@1.modules/exchange.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { parse } from "date-fns";
import { z } from "zod";

//

const exchange_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Exchange_Schema.parse(
        await prisma.exchange.findFirstOrThrow({ where: { id } }),
      ) as Exchange;
    }),

  find: procedure
    .input(z.object({ cursor: z.string().nullable() }))
    .query(async () => {
      return [
        {
          title: "Visite expo Picasso en couleurs",
          available_places: 3,
          places: 5,
          when: parse("02/09/2023", "P", new Date()),
          description:
            "Dans une licence LEA, vous étudiez deux laus vous inscrivez à une licence où vous apprenez deux langues autres que l’anglais, vous aurez des cours d’anglais en plus). Le but n’est pas seulement de perfectionner communication…",
        },
      ] as Exchange[];
    }),
});

export default exchange_api_router;
export type ExchangeApiRouter = typeof exchange_api_router;
