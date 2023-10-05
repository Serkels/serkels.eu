//

import { createContext } from ":api/trpc/[trpc]/route";
import { app_router } from ":trpc/router";
import debug from "debug";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { StrapiPasswordlessProvider } from "./StrapiPasswordlessProvider";

//

export const log = debug("~:app/api/auth/[...nextauth]/route.ts");

//

export const authOptions: NextAuthOptions = {
  providers: [StrapiPasswordlessProvider()],
  callbacks: {
    async jwt({ user, token, trigger }) {
      log("jwt", { trigger });
      if (trigger === "update" && token.user) {
        const trpc = app_router.createCaller(await createContext());
        const profile = await trpc.profile.me();

        token.user.name = [
          profile?.data?.attributes?.firstname,
          profile?.data?.attributes?.lastname,
        ].join(" ");
      }

      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token, trigger }) {
      log("session", { trigger });
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
};

//

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
