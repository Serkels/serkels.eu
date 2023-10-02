//

import type { OpenAPI_Repository } from "./openapi.repository";

//
// export const createContext = async (opts: CreateNextContextOptions) => {
//   const session = await getSession({ req: opts.req });

//   return {
//     openapi: new OpenAPI_Repository(fromServer, session?.user?.jwt),
//     session,
//   };
// };
export type TRPCContext<Client> = {
  openapi: OpenAPI_Repository<Client>;
  session: {} | null;
};

// export const TrpcContext = () => initTRPC
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
