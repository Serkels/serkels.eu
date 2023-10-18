import create_NextAuth_router from "./router/adapter";
import create_EmailProvider_router, {
  type SendEmailResolverFn,
} from "./router/email";
import { router } from "./trpc";

export const moked_auth_route = router({
  auth: router({
    next_auth_adapter: create_NextAuth_router("MOCK"),
    next_auth_provider: create_EmailProvider_router("MOCK", {
      resolver: (() => {}) as any as SendEmailResolverFn<any>,
    }),
  }),
});

export type Mock_NextAuth_TRPCAuthRouter = typeof moked_auth_route;
