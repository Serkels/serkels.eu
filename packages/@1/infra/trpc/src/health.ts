//

import { maybe_session_procedure, procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const status_schema = z.enum(["OK", "AUTHENTICATED", "FAIL"]);
export default router({
  ping: procedure.query(() => ({ status: "ok" })),
  database: procedure.query(async ({ ctx: { prisma } }) => ({
    status: (await prisma.$queryRaw`SELECT 1`) ? "OK" : "FAIL",
  })),
  session: maybe_session_procedure.query(async ({ ctx: { session } }) => ({
    status: session?.profile
      ? status_schema.enum.AUTHENTICATED
      : status_schema.enum.OK,
  })),
});
