//

import { initTRPC } from "@trpc/server";
import { z } from "zod";

//

const { router, procedure } = initTRPC.create();

export default router({
  hello: procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hello, ${input.name}!`),
});
