//

import { app_router, create_public_context } from ":api/trpc/[trpc]/route";
import debug from "debug";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

//

const log = debug("~:app/api/auth/[...nextauth]/StrapiPasswordlessProvider.ts");

//

const PasswordlessUser_Schema = z.object({
  jwt: z.string(),
  user: z.object({
    id: z.coerce.number().transform(String),
  }),
  context: z.any(),
});

async function login(token: string) {
  const trpc = app_router.createCaller(await create_public_context());
  const login_response = await trpc.passwordless.login({
    token,
  });

  log("<authorize> user", login_response);

  return PasswordlessUser_Schema.parse(login_response, {
    path: ["login_response.user"],
  });
}

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

        const { jwt, user, context } = await login(token);
        trace("user=", { jwt, user, context });

        // const partner = await partner_repository.find_me().catch(() => undefined);
        return {
          id: Number(user.id),
          role: "studient",
          jwt,
          profile: {},
          username: "",
        } satisfies User;
      } catch (error) {
        trace("error", error);
        return null;
      }

      // //
      // const trpc = app_router.createCaller(await create_authorized_context({}));

      // const profile = await await trpc.profile.me();
      // log("<authorize> profile", profile);

      // if (!credentials) return null;
      // const user = await passwordless_login(credentials.token);
      // if (!user) return null;
      // const profile = await user_profile(user.jwt);
      // // const repository =
      // //   NextTsyringe.injector(Root_Module).resolve(OpenAPI_Repository);
      // // const partner_repository = new Partner_Repository(openapi);
      // const partner_repository = {
      //   async find_me() {
      //     // throw NotImplemented Error;
      //     throw new Error("NotImplemented Error");
      //   },
      // };
      // const partner = await partner_repository.find_me().catch(() => undefined);

      // return { id: 42 } satisfies User;
      // return {
      //   ...user,
      //   role: partner ? "partner" : "studient",
      //   partner,
      //   profile,
      //   name: [
      //     profile?.attributes?.firstname,
      //     profile?.attributes?.lastname,
      //   ].join(" "),
      // } satisfies User;
    },
  });
}
