//

//

import type { AdapterUser, VerificationToken } from "@auth/core/adapters";
import type { Adapter } from "next-auth/adapters";
import { z } from "zod";
import { verify_next_auth_token } from "../guards";
import { procedure, router } from "../trpc";

//

//
// Inspired by https://github.com/nextauthjs/next-auth/tree/main/packages/adapter-prisma/src/index.ts
// \from https://github.com/nextauthjs/next-auth/blob/c4ad77b86762b7fd2e6362d8bf26c5953846774a/packages/adapter-prisma/src/index.ts
//

export type NextAuth_Router = ReturnType<typeof create_NextAuth_router>;
export type NextAuth_AdapterProcedures = keyof Adapter;

export function create_NextAuth_router(secret: string) {
  const next_auth_procedure = procedure.use(verify_next_auth_token(secret));

  return router({
    //
    createUser: next_auth_procedure
      .input(z.object({ email: z.string() }).passthrough())
      .mutation(
        async ({ ctx, input }) =>
          (await ctx.prisma.user.create({ data: input })) as AdapterUser,
      ),
    //   getUser: (id) => p.user.findUnique({ where: { id } }),

    getUserByEmail: next_auth_procedure
      .input(z.string())
      .query(
        async ({ ctx: { prisma }, input: email }): Promise<AdapterUser> =>
          (await prisma.user.findUnique({ where: { email } })) as AdapterUser,
      ),

    updateUser: next_auth_procedure
      .input(z.object({ id: z.string() }).passthrough())
      .mutation(
        async ({ ctx: { prisma }, input: { id, ...data } }) =>
          (await prisma.user.update({ where: { id }, data })) as AdapterUser,
      ),
    deleteUser: next_auth_procedure
      .input(z.string())
      .mutation(
        async ({ ctx: { prisma }, input: id }) =>
          (await prisma.user.delete({ where: { id } })) as AdapterUser,
      ),

    createVerificationToken: next_auth_procedure
      .input(
        z.object({
          identifier: z.string(),
          token: z.string(),
          expires: z.date(),
        }),
      )
      .mutation(async ({ ctx: { prisma }, input }) => {
        const verificationToken = await prisma.verificationToken.create({
          data: input,
        });
        return verificationToken as VerificationToken | null | undefined;
      }),

    useVerificationToken: next_auth_procedure
      .input(
        z.object({
          identifier: z.string(),
          token: z.string(),
        }),
      )
      .mutation(async ({ ctx: { prisma }, input }) => {
        console.log(input);
        try {
          const verificationToken = await prisma.verificationToken.delete({
            where: { identifier_token: input },
          });
          return verificationToken as VerificationToken;
        } catch (error) {
          throw error;
        }
      }),
  });
}

export default create_NextAuth_router;
