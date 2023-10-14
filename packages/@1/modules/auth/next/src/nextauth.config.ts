//

import type { Router } from "@1.infra/trpc";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { NextAuthOptions } from "next-auth";
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

export const authOptions: NextAuthOptions = {
  jwt: {
    maxAge: (86400 satisfies _24_HOURS_) * 30, // 30 days
  },
  session: {
    maxAge: (86400 satisfies _24_HOURS_) * 30, // 30 days
    strategy: "jwt",
    updateAge: 86400 satisfies _24_HOURS_,
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      id: "passwordless",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        console.log({ credentials });
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
          };
        } catch (error) {
          console.log("<authorize>", { error });
        }
        return null;
      },
    }),
  ],
};
