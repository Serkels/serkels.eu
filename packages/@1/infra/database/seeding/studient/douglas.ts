//

import { PrismaClient } from "@prisma/client";

//

export async function create_douglas_student(prisma: PrismaClient) {
  const { id } = await prisma.student.create({
    data: {
      city: "London",
      field_of_study: "Film",
      id: "douglas-student",
      profile: {
        create: {
          image: "https://picsum.photos/200/300",
          name: "Douglas",
          role: "STUDENT",
          user: {
            create: {
              email: "douglas@example.com",
              name: "Douglas",
            },
          },
        },
      },
      university: "University of London",
    },
    select: { id: true },
  });

  return id;
}
