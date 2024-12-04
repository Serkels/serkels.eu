//

import { startSpan } from "@1.modules/core/telemetry";
import { router, session_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  by_id: session_procedure
    .input(z.string())
    .query(({ input: id, ctx: { prisma } }) => {
      return startSpan(
        {
          name: `prisma.profile.findFirstOrThrow(${id})`,
          op: "prisma",
        },
        function findFirstOrThrow() {
          return prisma.profile.findUniqueOrThrow({
            include: {
              in_contact_with: { select: { id: true } },
              contacts: { select: { id: true } },
            },
            where: { id },
          });
        },
      );
    }),
});
