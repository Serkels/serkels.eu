//

import { PrismaClient } from "#prisma/client";

//

export async function create_johan_student(prisma: PrismaClient) {
  const { id } = await prisma.student.create({
    data: {
      city: "Stockholm",
      created_at: new Date(),
      field_of_study: "Film",
      id: "johan_student_id",
      profile: {
        create: {
          created_at: new Date(),
          id: "johan_profile_id",
          image: "https://picsum.photos/200/300",
          name: "Johan",
          role: "STUDENT",
          updated_at: new Date(),
          user: {
            create: {
              id: "johan_user_id",
              email: "johan@example.com",
              name: "Johan",
            },
          },
        },
      },
      university: "Stockholm University",
      updated_at: new Date(),
    },
    select: { id: true },
  });

  return id;
}
