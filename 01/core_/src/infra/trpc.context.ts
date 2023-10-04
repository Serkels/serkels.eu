//

import { initTRPC } from "@trpc/server";
import debug from "debug";
import { Lifecycle, injectable, scoped } from "tsyringe";
import type { OpenAPI_Repository } from "./openapi.repository";

//

@scoped(Lifecycle.ContainerScoped)
@injectable()
export class OpenApiTrpc<Client> {
  #log = debug(`~:core:infra:OpenApiTrpc`);

  static readonly TOKEN = {
    CLIENT: Symbol.for("client"),
    JWT: Symbol.for("jwt"),
  };

  constructor(public readonly openapi: OpenAPI_Repository<Client>) {
    this.#log("new");
  }

  t = initTRPC.context<{ openapi: OpenAPI_Repository<Client> }>().create();
  router = this.t.router;
  procedure = this.t.procedure;
}

// export const createContext = async (opts: CreateNextContextOptions) => {
//   const session = await getSession({ req: opts.req });

//   return {
//     openapi: new OpenAPI_Repository(fromServer, session?.user?.jwt),
//     session,
//   };
// };
// export type TRPCContext<Client> = {
//   openapi: OpenAPI_Repository<Client>;
//   session: {} | null;
// };

// export const TrpcContext = initTRPC.context<TRPCContext<Client>>()
// .context<TRPCContext>()
// .create({
//   transformer: SuperJSON,
//   errorFormatter: ({ shape, error }) => ({
//     ...shape,
//     data: {
//       ...shape.data,
//       zodError:
//         error.cause instanceof ZodError ? error.cause.flatten() : null,
//     },
//   }),
// })
