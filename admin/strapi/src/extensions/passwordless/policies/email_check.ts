//

import type { StrapiContext } from "~/types";

export default async (
  policyContext: StrapiContext & { request: { body: unknown } },
  _config,
  { strapi },
) => {
  const body = policyContext.request.body as
    | { email: string | undefined; context: object }
    | undefined;
  if (!body) {
    strapi.log.warn(
      `extensions/passwordless/policies/email_check.ts requires a request body`,
    );
    return false;
  }

  const { email, context } = body;
  if (!email) {
    strapi.log.warn(
      `extensions/passwordless/policies/email_check.ts requires an email in the body`,
    );
    return false;
  }

  if (context) {
    return true;
  }

  const users = await strapi.entityService.findMany(
    "plugin::users-permissions.user",
    {
      filters: { confirmed: true, email },
    },
  );

  return Boolean(users.length);
};
