//

import { next_auth_procedure, router } from "@1.module/trpc";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { z } from "zod";

//

const profile_api_router = router({
  create: next_auth_procedure
    .input(z.object({ role: PROFILE_ROLES }))
    .mutation(async ({ input, ctx }) => {
      input;
      ctx;
      return {};
    }),
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
