//

import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { GetValues, KoaContext, Next, Partner_Role_Schema } from "~/types";

//

// Inspired by https://github.com/kucherenko/strapi-plugin-passwordless/blob/a4365af0cd949a7083b01fb54db5d79d7ce43387/server/controllers/auth.js#L96-L105

const Partner_Schema = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().trim().email(),
  description: z.string().trim().nonempty(),
  location: z.string().trim().nonempty(),
  website: z.string().trim().nonempty().url(),
  role: Partner_Role_Schema,
});
const Studient_Schema = z.object({
  about: z.string().trim().optional(),
  email: z.string().trim().email(),
  firstname: z.string().trim().nonempty(),
  lastname: z.string().trim().nonempty(),
  university: z.string().trim().optional(),
});
export function create_user_middleware() {
  return async function create_user(
    context: KoaContext<GetValues<"plugin::passwordless.token">>,
    next: Next,
  ) {
    const email = z
      .string()
      .email()
      .safeParse(context.request.body?.email, {
        path: ["context.request.body.email"],
      });

    if (!email.success) {
      return context.throw(400, "Invalid email");
    }

    const token_context = context.request.body?.context as {
      role: string;
      username?: string;
    };
    const { passwordless } = strapi.plugins["passwordless"].services;

    const user = await passwordless.user(email.data, null);
    if (!user && token_context) {
      // Create user with corect role if not existing
      const userSettings = await passwordless.userSettings();

      const role: { id: number } = await strapi
        .query("plugin::users-permissions.role")
        .findOne({
          where: { type: token_context?.role ?? userSettings.default_role },
        });
      if (!role) {
        return context.throw(400, "Invalid role");
      }
      await strapi.entityService.create("plugin::users-permissions.user", {
        data: {
          email: email.data,
          username: token_context.username || email.data,
          role: role.id,
        },
      });
    }

    try {
      if (token_context) {
        const validator =
          token_context.role === "partner" ? Partner_Schema : Studient_Schema;
        context.request.body.context = validator.parse(token_context, {
          path: ["token_context"],
        });
      }
    } catch (error) {
      return context.throw(400, fromZodError(error));
    }
    //
    //
    //
    return next();
  };
}
