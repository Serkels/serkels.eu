//

import { PrismaClient } from "#prisma/client";

//

export async function create_douglas_student(prisma: PrismaClient) {
  const { id } = await prisma.student.create({
    data: {
      city: "London",
      created_at: new Date(),
      field_of_study: "Film",
      id: "douglas_student_id",
      profile: {
        create: {
          id: "douglas_profile_id",
          image: "https://picsum.photos/200/300",
          name: "Douglas",
          role: "STUDENT",
          user: {
            create: {
              email: "douglas@example.com",
              id: "douglas_user_id",
              name: "Douglas",
            },
          },
        },
      },
      university: "University of London",
      updated_at: new Date(),
    },
    select: { id: true },
  });

  return id;
}
