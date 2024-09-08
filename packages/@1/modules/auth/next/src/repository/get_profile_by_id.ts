//

import prisma from "@1.infra/database";

//

export function get_profile_by_id(id: string) {
  return prisma.profile.findUnique({
    select: { id: true },
    where: { id },
  });
}
