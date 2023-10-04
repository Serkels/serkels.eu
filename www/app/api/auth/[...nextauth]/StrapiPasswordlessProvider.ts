//

import { app_router, create_public_context } from ":api/trpc/[trpc]/route";
import debug from "debug";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

//

const log = debug("~:app/api/auth/[...nextauth]/StrapiPasswordlessProvider.ts");

export function StrapiPasswordlessProvider() {
  return CredentialsProvider({
    name: "Strapi Passwordless",
    credentials: {
      token: { label: "Token", type: "text" },
    },

    async authorize(credentials) {
      const trace = log.extend("<authorize>");
      try {
        const { token } = z
          .object({ token: z.string() })
          .parse(credentials, { path: ["credentials"] });
        trace("token=", token);

        const public_trpc = app_router.createCaller(
          await create_public_context(),
        );
        const { jwt, user, context } = await public_trpc.passwordless.login({
          token,
        });
        trace("user=", { jwt, user, context });

        const jwt_trpc = app_router.createCaller(
          await create_public_context(jwt),
        );
        const profile = await jwt_trpc.profile.me();
        trace("profile=", profile);

        return {
          id: Number(profile?.data?.id),
          role: "studient",
          jwt,
          name: [
            profile?.data?.attributes?.firstname,
            profile?.data?.attributes?.lastname,
          ].join(" "),
        } satisfies User;
      } catch (error) {
        trace("error", error);
        return null;
      }
    },
  });
}
