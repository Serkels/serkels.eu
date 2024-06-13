import { Student_Schema, type Student } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

export const student_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.student.findUniqueOrThrow({
        where: { id },
      });
    }),

  by_profile_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: profile_id, ctx: { prisma } }) => {
      return Student_Schema.parse(
        await prisma.student.findFirstOrThrow({
          where: { profile_id },
          include: { interest: true, profile: true },
        }),
        {
          path: ["<student.by_profile_id>.prisma.student.findFirstOrThrow"],
        },
      ) as Student;
    }),
  //

  me: router({
    update: next_auth_procedure
      .input(Student_Schema.omit({ id: true, profile: true, interest: true }))
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id: profile_id } = payload.profile;
        return prisma.student.update({
          data: {
            ...input,
            updated_at: new Date(),
          },
          where: { profile_id },
        });
      }),
  }),
});
