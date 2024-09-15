//

import type { Profile } from "@1.modules/profile.domain";
import { create_nextauth_header as any_create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import type { ProcedureBuilder, ProcedureParams } from "@trpc/server";

//

export type { Context } from "./context";
export const create_nextauth_header = any_create_nextauth_header<{
  profile: Pick<Profile, "id" | "role">;
}>;

export {
  createCallerFactory,
  maybe_next_auth_procedure,
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

//

export const with_previous_cursor =
  <TData>(limit: number, data: TData[]) =>
  <TCursor>(predicate: (data: TData) => TCursor) => {
    let prevCursor: TCursor | undefined = undefined;
    if (data.length > limit) {
      const prev_item = data.pop()!;
      prevCursor = predicate(prev_item);
    }

    return { data, prevCursor };
  };

export const with_next_cursor =
  <TData>(limit: number, data: TData[]) =>
  <TCursor>(predicate: (data: TData) => TCursor) => {
    let next_cursor: TCursor | undefined = undefined;
    if (data.length > limit) {
      const next_item = data.pop()!;
      next_cursor = predicate(next_item);
    }

    return { data, next_cursor };
  };
