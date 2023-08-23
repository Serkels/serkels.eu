import type { Notification } from "@1/modules/notification/domain";
import { type Observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
export interface AppContext {
    subscription_to: {
        notifications: (id: number) => Observable<Notification, unknown>;
        messages: (id: number) => Observable<Notification, unknown>;
    };
    verify_jwt: (token: string) => Promise<{
        id: number;
    }>;
}
export declare const router: <TProcRouterRecord extends import("@trpc/server").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: AppContext;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: typeof SuperJSON;
}>, TProcRouterRecord>;
export declare const publicProcedure: import("@trpc/server").ProcedureBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: AppContext;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: typeof SuperJSON;
    }>;
    _ctx_out: AppContext;
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
    _meta: object;
}>;
export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: AppContext;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: typeof SuperJSON;
}>, {
    notifications: import("@trpc/server").BuildProcedure<"subscription", {
        _config: import("@trpc/server").RootConfig<{
            ctx: AppContext;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: typeof SuperJSON;
        }>;
        _meta: object;
        _ctx_out: AppContext;
        _input_in: string;
        _input_out: string;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, Observable<import("@1/modules/notification/domain").Notification_New_Answer, unknown>>;
}>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map