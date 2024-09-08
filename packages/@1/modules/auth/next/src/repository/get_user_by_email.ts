//

import prisma from "@1.infra/database";

//

export function get_user_by_email(email: string) {
  return prisma.user.findUnique({
    select: { id: true },
    where: { email },
  });
}
