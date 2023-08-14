//

import { StrapiContext } from "../../../types";

export default async (policyContext: StrapiContext, _config, { strapi }) => {
  const body = policyContext.request.body as
    | { email: string | undefined }
    | undefined;
  if (!body) {
    strapi.log.warn(
      `extensions/passwordless/policies/email_check.ts requires a request body`,
    );
    return false;
  }

  const { email } = body;
  if (!email) {
    strapi.log.warn(
      `extensions/passwordless/policies/email_check.ts requires an email in the body`,
    );
    return false;
  }

  const users = await strapi.entityService.findMany(
    "plugin::users-permissions.user",
    {
      filters: { confirmed: true, email },
    },
  );

  return Boolean(users.length);
};
