//

import { procedure, router } from "@1.modules/trpc";
import { readFile } from "fs/promises";
import { z } from "zod";

//

export default router({
  verify: procedure
    .input(z.object({ email: z.string() }))
    .mutation(async () => {
      return readFile("./who.md", "utf8");
    }),
});
