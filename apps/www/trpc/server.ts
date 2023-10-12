//

import { appRouter } from "@toctocorg/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
// import { app_router } from "./router";

//

export const TRPC_SSR = createServerSideHelpers({
  router: appRouter,
  ctx: {},
  transformer: SuperJSON,
});
// export async function get_trpc() {
//   return createServerSideHelpers({
//     router: app_router,
//     ctx: await createContext(),
//     transformer: SuperJSON,
//   });
// }
