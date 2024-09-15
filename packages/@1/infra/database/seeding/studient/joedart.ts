//

import { PrismaClient } from "@prisma/client";

//

export async function create_joedart_student(prisma: PrismaClient) {
  const { id } = await prisma.student.create({
    data: {
      city: "Harbor Springs, Michigan",
      field_of_study: "Groove",
      id: "joedart-student",
      profile: {
        create: {
          image: "https://picsum.photos/200/300",
          name: "Joe Dart",
          role: "STUDENT",
          user: {
            create: {
              email: "joedart@vulfpeck.com",
              name: "Joe Dart",
            },
          },
        },
      },
      university: "Université du Michigan",
    },
    select: { id: true },
  });

  return id;
}
