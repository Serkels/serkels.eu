/**
 * user-profile service
 */

import { factories } from "@strapi/strapi";
import { createHash } from "node:crypto";

export default factories.createCoreService(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    gravatarUrlFor,
  }),
);

//

function gravatarUrlFor(email: string) {
  // see https://fr.gravatar.com/site/implement/images/

  const hash = createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");

  const paramsObj = { default: "identicon", size: "256px" };
  const searchParams = new URLSearchParams(paramsObj);
  return `https://www.gravatar.com/avatar/${hash}?${searchParams.toString()}`;
}
