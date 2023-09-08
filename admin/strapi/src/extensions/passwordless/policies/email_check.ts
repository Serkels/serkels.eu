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
    strapi.log.warn(`plugin::passwordless.email_check requires a request body`);
    return false;
  }

  const { email, context } = body;
  if (!email) {
    strapi.log.warn(
      `plugin::passwordless.email_check requires an email in the body`,
    );
    return false;
  }

  if (context) {
    // Allow access if a email and a context are sent (signup use case)
    return true;
  }

  const users = await strapi.entityService.findMany(
    "plugin::users-permissions.user",
    {
      filters: { confirmed: true, email },
    },
  );

  // Allow access if we find any confirmed user with this email (login use case)
  // Forbid access if no confirmed user with this email is found
  return Boolean(users.length);
};
