//

import type { Profile } from "@1.modules/profile.domain";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { decode } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { verify_next_auth_token } from "@douglasduteil/nextauth...trpc.prisma/trpc";
import { TRPCError, initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError, z } from "zod";
import type { Context } from "./context";

//
export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure,
  router,
} = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// export type Procedure = inferProcedureBuilderResolverOptions<typeof procedure>;
export const next_auth_procedure = procedure
  .use(verify_next_auth_token<{ profile: Profile }>())
  .use(async ({ ctx: { payload }, next }) => {
    if (!payload.profile) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        cause: new Error("No profile"),
      });
    }
    return next();
  });

export const maybe_next_auth_procedure = procedure.use(
  verify_next_auth_token<{ profile?: Profile }>(true),
);

// export type Next_Auth_Procedure = inferProcedureBuilderResolverOptions<
//   typeof next_auth_procedure
// >;

export const next_auth_input_token = procedure
  .input(z.object({ token: z.string() }))
  .use(async ({ input, ctx, next }) => {
    const { NEXTAUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);
    try {
      const payload = (await decode({
        token: input.token,
        secret,
      })) as { profile: Profile };

      if (payload) {
        return next({ ctx: { ...ctx, payload } });
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
        cause: new Error("No payload"),
      });
    } catch (cause) {
      throw new TRPCError({ code: "PARSE_ERROR", cause });
    }
  });
