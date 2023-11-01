import { Profile_Schema } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export const me = router({
  contacts: next_auth_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id },
      } = payload;
      const { cursor, limit } = input;
      const { contacts: data } = await prisma.profile.findUniqueOrThrow({
        select: {
          contacts: {
            ...(cursor ? { cursor: { id: cursor } } : {}),
            take: limit + 1,
            orderBy: { name: "asc" },
          },
        },
        where: { id },
      });

      let next_cursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const next_item = data.pop()!;
        next_cursor = next_item.id;
      }

      return { data, next_cursor };
    }),

  update: next_auth_procedure
    .input(Profile_Schema.omit({ id: true, role: true }))
    .mutation(({ input, ctx: { prisma, payload } }) => {
      const { id } = payload.profile;
      return prisma.profile.update({
        data: {
          ...input,
          user: { update: { image: input.image, name: input.name } },
        },
        where: { id },
      });
    }),
});
