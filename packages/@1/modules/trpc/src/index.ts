//

export { create_nextauth_header } from "@1.modules/auth.next/jwt";
import { type ProcedureBuilder, type ProcedureParams } from "@trpc/server";

//

export { TRPCError } from "@trpc/server";
export { observable } from "@trpc/server/observable";
export type { Context } from "./context";

export {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure,
  router,
} from "./trpc";

export {
  maybe_next_auth_procedure,
  maybe_session_procedure,
  next_auth_procedure,
  session_procedure,
} from "./guards";

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
