//

import { procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  static: procedure.input(z.object({ email: z.string() })).query(async () => {
    // TODO(douglasduteil): get the content form the server somehow ;)
    throw new Error("To implement");
  }),
});
