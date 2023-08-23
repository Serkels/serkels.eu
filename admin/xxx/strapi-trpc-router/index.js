"use strict";
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const zod_1 = require("zod");
//
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
exports.router = t.router;
exports.publicProcedure = t.procedure;
//
exports.appRouter = t.router({
    notifications: t.procedure
        .input(zod_1.z.string())
        .subscription(async function notifications({ ctx, input: token }) {
        const { id: user_id } = await ctx.verify_jwt(token);
        return ctx.subscription_to.notifications(user_id);
    }),
});
