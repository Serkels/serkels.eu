//

import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import {
  create_nexauth_header,
  hashToken,
  type JWT,
} from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { PrismaTRPCAdapter } from "@douglasduteil/nextauth...trpc.prisma/next";
import type { NextAuth_TRPCAuthRouter } from "@douglasduteil/nextauth...trpc.prisma/trpc";
import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { NextAuthOptions } from "next-auth";
import {} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { randomBytes } from "node:crypto";
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
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: NEXT_MODULE_ENV.API_URL,
      headers: async ({}) => {
        const nexaut_header = await create_nexauth_header({
          secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
          token: {
            from: "@1.modules/auth.next",
            strategies: ["Only existing users can login"],
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

// const _LoginEmail_Provider = Email({
//   async sendVerificationRequest(params) {
//     await trpc.auth.next_auth_adapter.getUserByEmail.query(params.identifier);
//     await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
//   },
// });

// let { id: _an_id, ...LoginEmail_Provider } = _LoginEmail_Provider;
let SigninEmail_Provider = Email({
  secret: NEXTAUTH_TRPCENV.NEXTAUTH_SECRET,
  async sendVerificationRequest(params) {
    await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
  },
});
SigninEmail_Provider.sendVerificationRequest = async (params) => {
  await trpc.auth.next_auth_provider.sendVerificationRequest.mutate(params);
};
export const authOptions: NextAuthOptions = {
  adapter: PrismaTRPCAdapter(trpc.auth.next_auth_adapter),
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
    signIn: "/signup/verifing",
    signOut: "/#auth=signOut",
    error: "/#auth=error",
    verifyRequest: "/signup/verifing",
    newUser: "/@~/welcome",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("<signIn>", { user, account, profile, email, credentials });
      const userExists = await trpc.auth.next_auth_adapter.getUserByEmail.query(
        user?.email ?? "",
      );
      if (Boolean(userExists) && Boolean(userExists?.emailVerified))
        return true;
      if (
        Boolean(userExists) &&
        !Boolean(userExists?.emailVerified) &&
        Boolean(user.id)
      )
        return true;
      if (Boolean(userExists) && !Boolean(userExists?.emailVerified))
        return "/signup/verifing";
      if (!Boolean(email?.verificationRequest) && Boolean(user.id)) {
        return true;
      }
      return false;
    },

    async redirect({ url, baseUrl }) {
      if (0) console.log("<redirect>", { url, baseUrl });

      return baseUrl;
    },
    async session({ session, user, token, newSession, trigger }) {
      if (trigger)
        console.log("<session>", { session, user, token, newSession, trigger });

      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser, session, trigger }) {
      if (trigger)
        console.log("<jwt>", {
          token,
          user,
          account,
          profile,
          isNewUser,
          session,
          trigger,
        });

      if (user) {
        token.user = user;
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
              role: z.union([z.literal("partner"), z.literal("studient")]),
            })
            .parse(credentials, {
              path: ["<SigninEmail_Provider.authorize.input>", "credentials"],
            });

          const profile_exists =
            await trpc.auth.next_auth_adapter.getUserByEmail.query(
              credentials?.email ?? "",
            );

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
          // const _url = `${url}/api/auth/magic/${type}/${identifier}/${token}?${params}`;

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
              token: hashToken(token, {
                provider: SigninEmail_Provider.options,
              }),
              expires,
            }),
            //
            profile_exists
              ? Promise.resolve(profile_exists)
              : trpc.profile.create.mutate({
                  token,
                  role: input.role.toUpperCase(),
                }),
          ]);

          // const token =
          //   (await SigninEmail_Provider.generateVerificationToken?.()) ??
          //   randomBytes(32).toString("hex");
          const user_dto = {
            ...credentials,
            ...profile_exists,
            role: profile_exists?.role.toLowerCase() ?? credentials?.role,
          };

          const user = await z
            .object({
              id: z.string().default(""),
              jwt: z.string().default(""),
              email: z.string().trim().toLowerCase().email(),
              name: z.string().trim(),
              role: z.union([z.literal("partner"), z.literal("studient")]),
            })
            .parseAsync(user_dto, {
              path: ["<SigninEmail_Provider.authorize>", "user_dto"],
            });

          return user;
          // return user satisfies User;
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
