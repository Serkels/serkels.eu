import { NEXTAUTH_TRPCENV } from "@douglasduteil/nextauth...trpc.prisma/config";
import { create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { startSpan } from "@sentry/core";
import type { Span } from "@sentry/types";
import to from "await-to-js";
import { type NextAuthConfig } from "next-auth";
import { match, P } from "ts-pattern";
import { get_auth_profile_by_email } from "./repository/get_auth_profile_by_email";

//

function start_auth_span_decorator<TReturn>(
  name: string,
  callback: (span: Span) => TReturn,
) {
  return startSpan({ name, op: "@1.modules/auth.next" }, callback);
}

//

export default {
  async session(params) {
    const { token, session } = params;
    return start_auth_span_decorator("callback.session", async () => {
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
    });
  },

  async signIn(params) {
    return start_auth_span_decorator("callback.signIn", async () => {
      return match(params)
        .with({ email: { verificationRequest: true } }, () => true)
        .with({ user: { emailVerified: null } }, () => true)
        .with({ user: { emailVerified: P.instanceOf(Date) } }, () => true)
        .otherwise(() => false);
    });
  },

  async jwt(params) {
    return start_auth_span_decorator(
      `callback.jwt${params.trigger ? `#${params.trigger}` : ""}`,
      async () => {
        return match(params)
          .with(
            { trigger: "signUp", user: { email: P.select(P.string) } },
            async () => {
              return {
                ...params.token,
              };
            },
          )
          .with(
            { trigger: "signIn", user: { email: P.select(P.string) } },
            async (email) => {
              const [profile_err, profile] = await to(
                get_auth_profile_by_email(email),
              );
              if (profile_err) {
                return params.token;
              }
              return { ...params.token, profile };
            },
          )
          .with(
            { trigger: "update", token: { email: P.select(P.string) } },
            async (email) => {
              const profile = await get_auth_profile_by_email(email);
              return { ...params.token, profile };
            },
          )
          .otherwise(() => params.token);
      },
    );
  },
} as NonNullable<NextAuthConfig["callbacks"]>;
