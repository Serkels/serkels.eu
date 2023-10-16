//

import type { NextAuth_Router } from "@1.modules/auth.api/next_auth";
import type { Adapter } from "@auth/core/adapters";
import type { inferRouterProxyClient } from "@trpc/client";

//

// \from https://github.com/nextauthjs/next-auth/blob/c4ad77b86762b7fd2e6362d8bf26c5953846774a/packages/adapter-prisma/src/index.ts
export function PrismaTRPCAdapter(
  trpc: inferRouterProxyClient<NextAuth_Router>,
): Adapter {
  return {
    createUser: trpc.createUser.mutate,
    async getUser(id) {
      console.log("getUser", id);
      throw new Error("Not implemented");
    },
    getUserByEmail: trpc.getUserByEmail.query,
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", { providerAccountId, provider });
      throw new Error("Not implemented");
    },
    updateUser: trpc.updateUser.mutate,
    deleteUser: trpc.deleteUser.mutate,
    async linkAccount(account) {
      console.log("linkAccount", account);
      throw new Error("Not implemented");
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log("unlinkAccount", { providerAccountId, provider });
      throw new Error("Not implemented");
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log("createSession", { sessionToken, userId, expires });
      throw new Error("Not implemented");
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser", sessionToken);
      throw new Error("Not implemented");
    },
    async updateSession({ sessionToken }) {
      console.log("updateSession", { sessionToken });
      throw new Error("Not implemented");
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession", sessionToken);
      throw new Error("Not implemented");
    },
    createVerificationToken: trpc.createVerificationToken.mutate,
    useVerificationToken: trpc.useVerificationToken.mutate,
  };
}
