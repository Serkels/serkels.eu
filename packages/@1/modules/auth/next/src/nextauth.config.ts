//

import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { create_nexauth_header } from "@douglasduteil/nextauth...trpc.prisma/next/jwt";
import type { NextAuth_TRPCAuthRouter } from "@douglasduteil/nextauth...trpc.prisma/trpc";
import { PrismaTRPCAdapter } from "@douglasduteil/nextauth...trpc.prisma/trpc/PrismaTRPCAdapter";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Email from "next-auth/providers/email";
import SuperJSON from "superjson";
import { z } from "zod";

//

export const NEXT_MODULE_ENV = z
  .object({
    API_URL: z.string(),
  })
  .parse(process.env);

//

const trpc = createTRPCProxyClient<NextAuth_TRPCAuthRouter>({
  links: [
    httpBatchLink({
      url: NEXT_MODULE_ENV.API_URL,
      headers: async ({}) => {
        console.log(">>>>>>>>>>>>>>>>", NEXTAUTH_TRPCENV.NEXTAUTH_SECRET);

        const nexaut_header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: { from: "@1.modules/auth.next" },
          maxAge: 60,
        });
        return nexaut_header;
      },
    }),
  ],
  transformer: SuperJSON,
});

//

export const authOptions: NextAuthOptions = {
  adapter: PrismaTRPCAdapter(trpc.auth.next_auth_adapter) as Adapter,
  debug: true,
  jwt: {
    maxAge: (86400 satisfies _24_HOURS_) * 30, // 30 days
  },
  session: {
    maxAge: (86400 satisfies _24_HOURS_) * 30, // 30 days
    strategy: "jwt",
    updateAge: 86400 satisfies _24_HOURS_,
  },
  pages: {
    signIn: "/signup#authorized",
    signOut: "/#auth=signOut",
    error: "/#auth=error",
    verifyRequest: "/signup/verifing",
    newUser: "/welcome",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("<signIn>", { user, account, profile, email, credentials });
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },

    async redirect({ url, baseUrl }) {
      console.log("<redirect>", { url, baseUrl });

      return baseUrl;
    },
    async session({ session, user, token, newSession, trigger }) {
      console.log("<session>", { session, user, token, newSession, trigger });

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser, session, trigger }) {
      console.log("<jwt>", {
        token,
        user,
        account,
        profile,
        isNewUser,
        session,
        trigger,
      });

      return token;
    },
  },
  providers: [
    Email({
      async sendVerificationRequest(params) {
        await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(
          params,
        );
      },
    }),
  ],
};
