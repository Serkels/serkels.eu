//

import type { ProcedureBuilder, ProcedureParams } from "@trpc/server";
import { create_nextauth_header as any_create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import type { Profile } from "@1.modules/profile.domain";

//

export type { Context } from "./context";
export const create_nextauth_header = any_create_nextauth_header<{
  profile: Pick<Profile, "id" | "role">;
}>;

export {
  createCallerFactory,
  mergeRouters,
  middleware,
  next_auth_input_token,
  next_auth_procedure,
  procedure,
  router,
} from "./trpc";

export type inferProcedureInput<TQuery extends ProcedureBuilder<any>> =
  TQuery extends ProcedureBuilder<infer TParams>
    ? TParams extends ProcedureParams
      ? { ctx: TParams["_ctx_out"]; input: TParams["_input_out"] }
      : never
    : never;
