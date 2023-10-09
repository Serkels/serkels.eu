//

import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AppContext, AppRouter } from "./index";

//

export const TRPC_React: CreateTRPCReact<AppRouter, AppContext, null> =
  createTRPCReact<AppRouter, AppContext>({
    // abortOnUnmount: true,
  });

export const TRPC_REACT: () => CreateTRPCReact<
  AppRouter,
  AppContext,
  null
> = () => TRPC_React;
