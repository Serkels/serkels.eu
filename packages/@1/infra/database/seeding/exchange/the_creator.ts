//

import { PrismaClient } from "@prisma/client";

//

export function create_the_creator_exchange(
  prisma: PrismaClient,
  studient_id: string,
) {
  return prisma.exchange.create({
    data: {
      category: { connect: { id: "film_category_id" } },
      created_at: new Date("2011-11-10"),
      description: "The Creator is a good film and you should watch it ;)",
      id: "the_creator_exchange_id",
      is_active: true,
      is_online: true,
      owner: { connect: { id: studient_id } },
      places: 1,
      title: "The Creator",
      type: "PROPOSAL",
      updated_at: new Date("2011-11-10"),
    },
  });
}
