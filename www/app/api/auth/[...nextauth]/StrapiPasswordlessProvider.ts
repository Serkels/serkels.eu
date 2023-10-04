//

import {
  app_router,
  create_authorized_context,
  create_public_context,
} from ":api/trpc/[trpc]/route";
import debug from "debug";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

//

const log = debug("~:app/api/auth/[...nextauth]/StrapiPasswordlessProvider.ts");

//

const AuthUser = z.object({
  jwt: z.string(),
  user: z.object({
    id: z.coerce.number().transform(String),
  }),
  context: z.any(),
});
export function StrapiPasswordlessProvider() {
  return CredentialsProvider({
    name: "Strapi Passwordless",
    credentials: {
      token: { label: "Token", type: "text" },
    },

    async authorize(credentials) {
      log("<authorize> credentials", credentials);

      if (!credentials) return null;

      //

      const { jwt, user, context } = (async (token: string) => {
        const trpc = app_router.createCaller(await create_public_context());
        const login_response = await trpc.passwordless.login({
          token,
        });

        log("<authorize> user", login_response);

        return AuthUser.parse(login_response.user, {
          path: ["login_response.user"],
        });
      })(credentials.token);

      //
      const trpc = app_router.createCaller(await create_authorized_context());

      const profile = await await pubilc_trpc.profile.me();
      log("<authorize> profile", profile);

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

      return auth_user.user satisfies User;
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
