import type { Mock_NextAuth_TRPCAuthRouter } from "./mock";
import { router } from "./trpc";

export type NextAuth_TRPCRouter = ReturnType<typeof router>;
export type NextAuth_TRPCAuthRouter = Mock_NextAuth_TRPCAuthRouter;
