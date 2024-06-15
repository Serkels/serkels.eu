//

import { AuthError } from "@1.modules/core/errors";
import { type Profile } from "@1.modules/profile.domain";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import {
  create_nexauth_header,
  type JWT,
} from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { PrismaTRPCAdapter } from "@douglasduteil/nextauth...trpc.prisma/next";
import type { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { z } from "zod";
import { Email } from "./email.provider";
import { SignIn } from "./signin.provider";
import { trpc } from "./trpc";

//

const ENV = z
  .object({
    _01_NEXT_AUTH_JWT_MAX_AGE: z.coerce
      .number()
      .default((86_400 satisfies _24_HOURS_) * 30), // 30 days
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .parse(process.env);

//

export const auth_options: NextAuthOptions = {
  adapter: PrismaTRPCAdapter(trpc.auth.next_auth_adapter),
  debug: ENV.NODE_ENV !== "production",
  jwt: {
    maxAge: ENV._01_NEXT_AUTH_JWT_MAX_AGE,
  },
  session: {
    maxAge: ENV._01_NEXT_AUTH_JWT_MAX_AGE,
    strategy: "jwt",
    updateAge: 86_400 satisfies _24_HOURS_,
  },
  pages: {
    signIn: "/",
    signOut: "/#auth=signOut",
    error: "/#auth=error",
    verifyRequest: "/signup/verifing#request",
    newUser: "/@~/welcome",
  },

  callbacks: {
    async signIn({ user, account, email }) {
      const is_a_login_verification_request = Boolean(
        email?.verificationRequest,
      );
      if (is_a_login_verification_request) {
        const userExists =
          await trpc.auth.next_auth_adapter.getUserByEmail.query(
            user?.email ?? "",
          );
        // Only verify existing account on login
        return Boolean(userExists);
      }

      const is_signin_provider_verification_request =
        !account?.providerAccountId;

      if (is_signin_provider_verification_request) return "/signup/verifing";

      const adapter_user = user as AdapterUser;
      const is_signin_provider_verifivation_response =
        !adapter_user.emailVerified;
      if (is_signin_provider_verifivation_response)
        return Boolean(account?.providerAccountId === user.email);

      return Boolean(adapter_user.emailVerified); // # redirect to pages.signIn;
    },

    async session({ session, token }) {
      if (token.profile) {
        session.profile = token.profile;
        session.header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: {
            profile: {
              id: session.profile.id,
              name: "",
              image: "",
              role: session.profile.role,
              bio: "",
            } satisfies Profile,
          } satisfies JWT,
        });
      }

      return session;
    },
    async jwt({ token, user, trigger }) {
      try {
        if (trigger === "signUp" && user.email) {
          token.profile = await trpc.auth.payload.use_payload.mutate(
            user.email,
          );
        }

        if (trigger === "signIn" && user.id && user.email) {
          token.profile = await trpc.profile.by_email.query(user.email);
        }
        if (trigger === "update" && token.email) {
          token.profile = await trpc.profile.by_email.query(token.email);
        }
      } catch (error) {
        console.error(new AuthError("Profile not found", { cause: error }));
      }

      return token;
    },
  },
  providers: [SignIn, Email],
};
