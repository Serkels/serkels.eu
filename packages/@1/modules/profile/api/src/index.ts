//

import { Profile_Schema, type Profile } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const profile_api_router = router({
  by_email: next_auth_procedure
    .input(z.string())
    .query(async ({ input: email, ctx: { prisma } }) => {
      return Profile_Schema.parse(
        await prisma.profile.findFirstOrThrow({ where: { user: { email } } }),
      ) as Profile;
    }),
});

export default profile_api_router;
export type ProfileApiRouter = typeof profile_api_router;
