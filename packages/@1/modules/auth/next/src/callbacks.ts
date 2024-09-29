import prisma from "@1.infra/database";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { startSpan } from "@sentry/core";
import { AuthError, type NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { get_auth_profile_by_email } from "./repository/get_auth_profile_by_email";
import { CreateProfileFromSignupPayload } from "./usecase/create_profile_from_signup_payload";

//

type Callbacks = NonNullable<NextAuthConfig["callbacks"]>;

//

export const authorized: Callbacks["authorized"] = async ({
  request,
  auth,
}) => {
  const url = request.nextUrl;
  console.log("authorized", url);
  if (request.method === "POST") {
    const { authToken } = (await request.json()) ?? {};
    // If the request has a valid auth token, it is authorized
    console.log(authToken);
    // const valid = await validateAuthToken(authToken)
    // if(valid) return true
    return NextResponse.json("Invalid auth token", { status: 401 });
  }

  // Logged in users are authenticated, otherwise redirect to login page
  return Boolean(auth?.user);
};

//

export default {
  async authorized({ request, auth }) {
    const url = request.nextUrl;
    console.log("authorized", url);
    if (request.method === "POST") {
      const { authToken } = (await request.json()) ?? {};
      // If the request has a valid auth token, it is authorized
      console.log(authToken);
      // const valid = await validateAuthToken(authToken)
      // if(valid) return true
      return NextResponse.json("Invalid auth token", { status: 401 });
    }

    // Logged in users are authenticated, otherwise redirect to login page
    return Boolean(auth?.user);
  },

  async session({ token, session }) {
    return startSpan(
      { name: "auth.config.ts#session", op: "@1.modules/auth.next" },
      async () => {
        const { NEXTAUTH_SECRET: secret } = NEXTAUTH_TRPCENV.parse(process.env);
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.profile) {
          session.profile = token.profile;
          session.header = await create_nextauth_header({
            secret,
            salt: "",
            token: {
              profile: token.profile,
            },
          });
        }
        return session;
      },
    );
  },
  async signIn({ account }) {
    return startSpan(
      { name: "auth.config.ts#signIn", op: "@1.modules/auth.next" },
      async () => {
        if (!account) return false;
        return true;
      },
    );
  },
  async jwt({ token, user, trigger }) {
    return startSpan(
      { name: "auth.config.ts#jwt", op: "@1.modules/auth.next" },
      async () => {
        try {
          if (trigger === "signUp" && user.email) {
            const create_profile_from_signup_payload =
              CreateProfileFromSignupPayload({
                prisma,
              });
            token.profile = await create_profile_from_signup_payload(
              user.email,
            );
          }

          if (trigger === "signIn" && user.email) {
            token.profile = await get_auth_profile_by_email(user.email);
          }

          if (trigger === "update" && token.email) {
            token.profile = await get_auth_profile_by_email(token.email);
          }
        } catch (error) {
          console.error(new AuthError("Profile not found", { cause: error }));
        }

        return token;
      },
    );
  },
} as Callbacks;
