//

import { PrismaClient } from "@prisma/client";

//

export async function create_film_category(prisma: PrismaClient) {
  const { id } = await prisma.category.create({
    data: {
      id: "film_category_id",
      name: "Film",
      slug: "film",
    },
    select: { id: true },
  });

  return id;
}
