//

import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { verify_next_auth_token } from "@douglasduteil/nextauth...trpc.prisma/trpc";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

//

export const { router, middleware, mergeRouters, procedure } = initTRPC
  .context<Context>()
  .create({
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

export const next_auth_procedure = procedure.use(
  verify_next_auth_token(NEXTAUTH_TRPCENV.NEXTAUTH_SECRET),
);
