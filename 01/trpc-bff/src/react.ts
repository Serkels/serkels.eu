//

import type { AppContext } from "@1/strapi-trpc-router";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./index";

//

export const TRPC_React: CreateTRPCReact<AppRouter, AppContext, null> =
  createTRPCReact<AppRouter, AppContext>({
    // abortOnUnmount: true,
  });
