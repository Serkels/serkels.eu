//

import { PrismaClient } from "#prisma/client";

//

export async function create_joedart_student(prisma: PrismaClient) {
  const { id } = await prisma.student.create({
    data: {
      city: "Harbor Springs, Michigan",
      created_at: new Date(),
      field_of_study: "Groove",
      id: "joedart_student_id",
      profile: {
        create: {
          id: "joedart_profile_id",
          image: "https://picsum.photos/200/300",
          name: "Joe Dart",
          role: "STUDENT",
          user: {
            create: {
              email: "joedart@vulfpeck.com",
              id: "joedart_user_id",
              name: "Joe Dart",
            },
          },
        },
      },
      university: "Université du Michigan",
      updated_at: new Date(),
    },
    select: { id: true },
  });

  return id;
}
