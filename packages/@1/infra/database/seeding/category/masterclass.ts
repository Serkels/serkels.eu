//

import { PrismaClient } from "@prisma/client";

//

export async function create_masterclass_category(prisma: PrismaClient) {
  const { id } = await prisma.category.create({
    data: {
      id: "masterclass-category",
      name: "Masterclass",
      slug: "masterclass",
    },
    select: { id: true },
  });

  return id;
}
