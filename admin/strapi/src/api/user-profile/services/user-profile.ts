/**
 * user-profile service
 */

import type { Profile_DTO } from "@/types";
import { factories } from "@strapi/strapi";
import { createHash } from "node:crypto";

export default factories.createCoreService(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    gravatarUrlFor,
    async findOneFromUser(user_id: number) {
      const profile = await findOneFromUser(user_id);
      return super.findOne(profile?.id);
    },
  }),
);

//

export async function findOneFromUser(id: number) {
  const profiles = await strapi.entityService.findMany(
    "api::user-profile.user-profile",
    {
      fields: ["id", "firstname", "lastname", "university"],
      filters: { owner: id },
    },
  );

  if (!profiles || !profiles[0]) {
    strapi.log.warn(
      `service::user-profile.user-profile :findOneFromUser(${id}): detected no profiles`,
    );
    return;
  }

  return profiles[0] as Profile_DTO;
}

function gravatarUrlFor(email: string) {
  // see https://fr.gravatar.com/site/implement/images/

  const hash = createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");

  const paramsObj = { default: "identicon", size: "256px" };
  const searchParams = new URLSearchParams(paramsObj);
  return `https://www.gravatar.com/avatar/${hash}?${searchParams.toString()}`;
}
