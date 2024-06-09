"use server";

import prisma from "@1.infra/database";
import { CategoryContext } from "@prisma/client";

//

export default async function get_categories() {
  return prisma.category.findMany({
    where: { OR: [{ context: CategoryContext.FORUM }, { context: null }] },
    orderBy: { rank: "desc" },
  });
}

export type get_categotires_dto = Awaited<ReturnType<typeof get_categories>>;
