//

import { PrismaClient } from "#prisma/client";

//

export async function create_vulfpeck_partner(prisma: PrismaClient) {
  const { id } = await prisma.partner.create({
    data: {
      city: "Ann Arbor, Michigan",
      link: "https://vulfpeck.com",
      id: "vulfpeck_partner_id",
      profile: {
        create: {
          id: "vulfpeck_profile_id",
          image: "https://picsum.photos/300/300",
          name: "Vulfpeck",
          role: "PARTNER",
          user: {
            create: {
              email: "partner@vulfpeck.com",
              id: "vulfpeck_user_id",
              name: "Vulfpeck",
            },
          },
        },
      },
    },
    select: { id: true },
  });

  return id;
}
