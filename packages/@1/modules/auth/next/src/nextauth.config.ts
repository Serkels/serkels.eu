//

import { prisma } from "@1.infra/database";
import type { Router } from "@1.infra/trpc";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import process from "node:process";
import SuperJSON from "superjson";
import { z } from "zod";

//

const ENV = z
  .object({
    API_URL: z.string(),
  })
  .parse(process.env);

const trpc = createTRPCProxyClient<Router>({
  links: [
    httpBatchLink({
      url: ENV.API_URL,
    }),
  ],
  transformer: SuperJSON,
});
prisma.post.findFirst().then(console.log, console.error);
export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  // adapter: {
  //   createUser: (data) => p.user.create({ data }),
  //   getUser: (id) => p.user.findUnique({ where: { id } }),
  //   getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
  //   async getUserByAccount(provider_providerAccountId) {
  //     const account = await p.account.findUnique({
  //       where: { provider_providerAccountId },
  //       select: { user: true },
  //     });
  //     return account?.user ?? null;
  //   },
  //   updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),
  //   deleteUser: (id) => p.user.delete({ where: { id } }),
  //   linkAccount: (data) =>
  //     p.account.create({ data }) as unknown as AdapterAccount,
  //   unlinkAccount: (provider_providerAccountId) =>
  //     p.account.delete({
  //       where: { provider_providerAccountId },
  //     }) as unknown as AdapterAccount,
  //   async getSessionAndUser(sessionToken) {
  //     const userAndSession = await p.session.findUnique({
  //       where: { sessionToken },
  //       include: { user: true },
  //     });
  //     if (!userAndSession) return null;
  //     const { user, ...session } = userAndSession;
  //     return { user, session };
  //   },
  //   createSession: (data) => p.session.create({ data }),
  //   updateSession: (data) =>
  //     p.session.update({ where: { sessionToken: data.sessionToken }, data }),
  //   deleteSession: (sessionToken) =>
  //     p.session.delete({ where: { sessionToken } }),
  //   async createVerificationToken(data) {
  //     const verificationToken = await p.verificationToken.create({ data });
  //     if (verificationToken.id) delete verificationToken.id;
  //     return verificationToken;
  //   },
  //   async useVerificationToken(identifier_token) {
  //     try {
  //       const verificationToken = await p.verificationToken.delete({
  //         where: { identifier_token },
  //       });
  //       if (verificationToken.id) delete verificationToken.id;
  //       return verificationToken;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  // },
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
    signIn: "/signup/authorized",
    signOut: "/#auth=signOut",
    error: "/#auth=error",
    verifyRequest: "/#auth=verifyRequest",
    newUser: "/#auth=newUser",
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
    CredentialsProvider({
      name: "Passwordless Login",
      id: "passwordless",
      credentials: {
        token: { label: "Token", type: "text" },
      },

      async authorize(credentials) {
        console.log("<passwordless.authorize>", { credentials });
        try {
          const token = z
            .string({ description: "token" })
            .parse(credentials?.token, {
              path: ["<authorize>", "credentials?.token"],
            });

          const login_data = await trpc.auth.passwordless.login.query({
            token,
          });

          return {
            id: login_data.user.id,
            jwt: login_data.jwt,
            name: login_data.user.email,
            role: "studient",
          } satisfies User;
        } catch (error) {
          console.log("<authorize>", { error });
        }
        return null;
      },
    }),
    {
      id: "email",
      type: "email",
      name: "Email",

      server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
      from: "Auth.js <no-reply@authjs.dev>",
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest(params) {
        console.log("<EmailsendVerificationRequest", { params });
      },

      options: {},
    },
    CredentialsProvider({
      name: "Magic Register",
      id: "register",

      credentials: {
        email: { label: "Email", type: "email" },
        firstname: { label: "Prenom", type: "text" },
        lastname: { label: "Nom", type: "text" },
      },

      async authorize(credentials) {
        console.log("<register.authorize>", { credentials });
        try {
          const input = z
            .object({
              email: z.string(),
              firstname: z.string(),
              lastname: z.string(),
            })
            .parse(credentials, {
              path: ["<authorize>", "credentials"],
            });

          console.log(input);
          return {
            id: "",
            jwt: "",
            name: "",
            role: "studient",
          } satisfies User;
        } catch (error) {
          console.log(error);
        }
        // try {
        //   const token = z
        //     .string({ description: "token" })
        //     .parse(credentials?.token, {
        //       path: ["<authorize>", "credentials?.token"],
        //     });

        //   const login_data = await trpc.auth.passwordless.login.query({
        //     token,
        //   });

        //   return {
        //     id: login_data.user.id,
        //     jwt: login_data.jwt,
        //     name: login_data.user.email,
        //     role: "studient",
        //   } satisfies User;
        // } catch (error) {
        //   console.log("<authorize>", { error });
        // }
        return null;
      },
    }),
  ],
};
