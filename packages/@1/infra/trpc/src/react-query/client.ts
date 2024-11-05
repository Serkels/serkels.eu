//

import {
  createTRPCReact,
  type TRPCClientError,
  type TRPCClientErrorLike,
} from "@trpc/react-query";
import { type Router } from "../index";

//

export type { TRPCClientErrorLike } from "@trpc/client";
export type TRPCClientRouterError = TRPCClientError<Router>;
export type TRPCClientRouterErrorLike = TRPCClientErrorLike<Router>;
export const trpc_client = createTRPCReact<Router>();
