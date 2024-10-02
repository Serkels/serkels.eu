//

import { createServerSideHelpers } from "@trpc/react-query/server";
import { createCallerFactory } from "@trpc/server";
import SuperJSON from "superjson";
import { context } from "../context";
import { router, type Router } from "../index";

//

export const trpc_server = createServerSideHelpers<Router>({
  router,
  transformer: SuperJSON,
  ctx: context,
});

export const trpc_caller = createCallerFactory()(router)(context);
