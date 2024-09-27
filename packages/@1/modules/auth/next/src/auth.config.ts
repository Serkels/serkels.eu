//

import prisma from "@1.infra/database";
import { Email_Sender } from "@1.infra/email";
import { SerkelsMagicLinkEmail } from "@1.modules/auth.emails";
import { get_auth_profile_by_email } from "@1.modules/auth.next/repository/get_auth_profile_by_email";
import { CreateProfileFromSignupPayload } from "@1.modules/auth.next/usecase/create_profile_from_signup_payload";
import { AuthError } from "@1.modules/core/errors";
import { create_nextauth_header } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import { startSpan } from "@sentry/core";
import type { NextAuthConfig } from "next-auth";
import type { EmailConfig } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { z } from "zod";

//

export const login_form_schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default {
  basePath: "/api/auth",
  debug: true,
  trustHost: true,
  callbacks: {
    async session({ token, session }) {
      return startSpan(
        { name: "auth.config.ts#session", op: "@1.modules/auth.next" },
        async () => {
          if (token.sub && session.user) {
            session.user.id = token.sub;
          }
          if (token.profile) {
            session.profile = token.profile;
            session.header = await create_nextauth_header({
              secret: process.env["AUTH_SECRET"]!,
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
  },
  pages: {
    signIn: "/",
    signOut: "/#auth=signOut",
    error: "/#auth=error",
    verifyRequest: "/signup/verifing#request",
    newUser: "/@~/welcome",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        return startSpan(
          { name: "auth.config.ts#authorize", op: "@1.modules/auth.next" },
          async () => {
            const { data, success } =
              await login_form_schema.safeParseAsync(credentials);
            if (!success) return null;

            const { email } = data;
            const user = await startSpan(
              { name: "get_user_by_email", op: "prisma" },
              function get_user_by_email() {
                return prisma.user.findUnique({
                  select: {
                    id: true,
                    email: true,
                    image: true,
                    emailVerified: true,
                  },
                  where: { email },
                });
              },
            );

            if (!user) throw new Error("No user found with this email");

            return null;
          },
        );
      },

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
    Nodemailer({
      server: { url: process.env["SMTP_URL"]! },
      async sendVerificationRequest(params) {
        const sender = new Email_Sender({
          EMAIL_FROM: process.env["EMAIL_FROM"]!,
          NODE_ENV: process.env["NODE_ENV"]!,
          REPORT_EMAIL_FROM: process.env["REPORT_EMAIL_FROM"]!,
          SMTP_URL: process.env["SMTP_URL"]!,
        });
        await sender.send_react_email(
          SerkelsMagicLinkEmail({
            base_url:
              params.request.headers.get("origin") ?? process.env["APP_URL"]!,
            url: params.url,
          }),
          {
            subject: "[Serkels] Connexion",
            to: params.identifier,
          },
        );
      },
    }) as EmailConfig,
  ],
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
