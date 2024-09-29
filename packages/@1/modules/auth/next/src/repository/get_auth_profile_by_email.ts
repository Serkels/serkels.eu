//

import prisma from "@1.infra/database";
import { startSpan } from "@sentry/core";
import type { AuthProfile } from "@1.modules/profile.domain";

//

export async function get_auth_profile_by_email(email: string) {
  const profile: AuthProfile | null = await startSpan(
    {
      name: `prisma.profile.findFirstOrThrow(${email})`,
      op: "prisma",
    },
    function findFirstOrThrow() {
      return prisma.profile.findFirstOrThrow({
        select: { id: true, role: true, name: true, image: true },
        where: { user: { email } },
      });
    },
  );
  return profile;
}
