//

import type { ProcedureBuilder, ProcedureParams } from "@trpc/server";

export type { Context } from "./context";
export {
  mergeRouters,
  middleware,
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
