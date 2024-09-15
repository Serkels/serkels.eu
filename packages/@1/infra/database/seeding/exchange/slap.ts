//

import { PrismaClient } from "@prisma/client";

//

export function create_slap_exchange(
  prisma: PrismaClient,
  studient_id: string,
) {
  return prisma.exchange.create({
    data: {
      category: { connect: { id: "masterclass-category" } },
      created_at: new Date("2011-11-11"),
      description: "https://vulf.co/courses/dart/lectures/45940163",
      id: "slap-exchange",
      is_active: true,
      is_online: true,
      owner: { connect: { id: studient_id } },
      places: 1,
      title: "Slap",
      type: "PROPOSAL",
      updated_at: new Date("2011-11-11"),
    },
  });
}
