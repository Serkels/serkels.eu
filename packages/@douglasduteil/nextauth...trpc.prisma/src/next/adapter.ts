//

import type { VerificationToken } from "@prisma/client";
import type { inferRouterProxyClient } from "@trpc/client";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { NextAuth_Router } from "../trpc/router/adapter";

//

//
// \from https://github.com/nextauthjs/next-auth/blob/c4ad77b86762b7fd2e6362d8bf26c5953846774a/packages/adapter-prisma/src/index.ts
//

//

export function PrismaTRPCAdapter(
  trpc: inferRouterProxyClient<NextAuth_Router>,
): Adapter {
  return {
    async createUser(data) {
      const user = await trpc.createUser.mutate(data);
      return user as AdapterUser;
    },
    async getUser(id) {
      console.log("getUser", id);
      throw new Error("Not implemented");
    },
    async getUserByEmail(email) {
      const user = await trpc.getUserByEmail.query(email);
      return user as AdapterUser;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount", { providerAccountId, provider });
      throw new Error("Not implemented");
    },
    async updateUser(email) {
      const user = await trpc.updateUser.mutate(email);
      return user as AdapterUser;
    },
    async deleteUser(id) {
      const user = await trpc.deleteUser.mutate(id);
      return user as AdapterUser;
    },
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
    async createVerificationToken(data) {
      const toekn = await trpc.createVerificationToken.mutate(data);
      return toekn as VerificationToken | null | undefined;
    },
    async useVerificationToken(identifier_token) {
      const toekn = await trpc.useVerificationToken.mutate(identifier_token);
      return toekn as VerificationToken | null;
    },
  };
}
