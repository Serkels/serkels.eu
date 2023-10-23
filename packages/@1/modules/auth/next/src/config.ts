//

import type { Router } from "@1.infra/trpc";
import { AuthError } from "@1.modules/core/errors";
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import {
  create_nexauth_header,
  hashToken,
  type JWT,
} from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { PrismaTRPCAdapter } from "@douglasduteil/nextauth...trpc.prisma/next";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { NextAuthOptions, User } from "next-auth";
import {} from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { randomBytes } from "node:crypto";
import SuperJSON from "superjson";
import { z } from "zod";

//

export const NEXT_AUTH_MODULES_ENV = z
  .object({
    _01_NEXT_AUTH_MODULES_TRPC_API_URL: z.string().url(),
    _01_NEXT_AUTH_JWT_MAX_AGE: z.coerce
      .number()
      .default((86400 satisfies _24_HOURS_) * 30), // 30 days
  })
  .parse(process.env);

//

const trpc = createTRPCProxyClient<Router>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: NEXT_AUTH_MODULES_ENV._01_NEXT_AUTH_MODULES_TRPC_API_URL,
      headers: async ({}) => {
        const nexaut_header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: {
            from: "@1.modules/auth.next",
            strategies: ["Only existing users can login"],
            profile: { id: "", image: "", name: "", role: "ADMIN", bio: "" },
          } satisfies JWT,
          maxAge: 60,
        });
        return nexaut_header;
      },
    }),
  ],
  transformer: SuperJSON,
});

//

const SigninEmail_Provider = Email({
  secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
  async sendVerificationRequest(params) {
    await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
  },
});
SigninEmail_Provider.sendVerificationRequest = async (params) => {
  await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
};
const User_DTO = z.object({
  id: z.string().default(""),
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim(),
  role: PROFILE_ROLES,
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaTRPCAdapter(trpc.auth.next_auth_adapter),
  debug: true,
  jwt: {
    maxAge: NEXT_AUTH_MODULES_ENV._01_NEXT_AUTH_JWT_MAX_AGE,
  },
  session: {
    maxAge: NEXT_AUTH_MODULES_ENV._01_NEXT_AUTH_JWT_MAX_AGE,
    strategy: "jwt",
    updateAge: 86400 satisfies _24_HOURS_,
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

      const is_signin_provider_verification_request = !Boolean(
        account?.providerAccountId,
      );
      if (is_signin_provider_verification_request) return "/signup/verifing";

      const adapter_user = user as AdapterUser;
      const is_signin_provider_verifivation_response = !Boolean(
        adapter_user.emailVerified,
      );
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
  providers: [
    Credentials({
      id: "SigninEmail_Provider",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials, req) {
        console.log("<session>", { credentials, req });

        try {
          const headers = req.headers ?? {};
          const origin_url = parseUrl(String(headers["origin"] ?? ""));
          console.log();
          const url = new URL("/", origin_url.href);

          const input = z
            .object({
              email: z.string().trim().toLowerCase().email(),
              name: z.string().trim(),
              university: z.string().optional(),
              role: PROFILE_ROLES,
            })
            .parse(credentials, {
              path: ["<SigninEmail_Provider.authorize.input>", "credentials"],
            });

          const user_exists =
            await trpc.auth.next_auth_adapter.getUserByEmail.query(
              credentials?.email ?? "",
            );

          if (user_exists) return null;

          const {
            generateVerificationToken = () => randomBytes(32).toString("hex"),
          } = SigninEmail_Provider;
          const token = await generateVerificationToken();

          const ONE_DAY_IN_SECONDS = 86400;
          const { maxAge = ONE_DAY_IN_SECONDS } = SigninEmail_Provider.options;
          const expires = new Date(Date.now() + maxAge * 1000);
          const { callbackUrl } = z
            .object({ callbackUrl: z.string().url().default(url.href) })
            .parse(req.query, { path: [""] });
          const { email: identifier } = input;

          // Generate a link with email, unhashed token and callback url
          const { type } = SigninEmail_Provider;
          const params = new URLSearchParams({
            callbackUrl,
            token,
            email: identifier,
          });

          const _url = new URL(`/api/auth/callback/${type}?${params}`, url);

          const token_id = hashToken(token, {
            provider: SigninEmail_Provider.options,
          });

          await Promise.all([
            // Send to user
            SigninEmail_Provider.sendVerificationRequest({
              identifier,
              token,
              expires,
              url: _url.href,
              provider: SigninEmail_Provider,
              theme: {},
            }),
            // Save in database
            trpc.auth.next_auth_adapter.createVerificationToken.mutate({
              identifier,
              token: token_id,
              expires,
            }),
            //
          ]);

          const user = await User_DTO.parseAsync(credentials, {
            path: ["<SigninEmail_Provider.authorize>", "credentials"],
          });

          await trpc.auth.payload.link.mutate({
            identifier,
            name: user.name,
            role: input.role,
            context:
              input.role === PROFILE_ROLES.Enum.STUDIENT
                ? { university: input.university }
                : {},
            token: token_id,
          });

          return user satisfies User;
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
    Email({
      secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
      async sendVerificationRequest(params) {
        await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(
          params,
        );
      },
    }),
  ],
};
