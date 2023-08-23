/**
 * user-profile service
 */

import { Profile_Schema } from "@1/strapi-openapi";
import { factories } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
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
  const entityService: EntityService = strapi.entityService;
  const profiles = await entityService.findMany(
    "api::user-profile.user-profile",
    {
      fields: ["id", "firstname", "lastname", "university"],
      filters: { owner: id },
    },
  );

  const profile = profiles[0] as Profile_Schema | undefined;
  if (profile === undefined) {
    strapi.log.warn(
      `service::user-profile.user-profile :findOneFromUser(${id}): detected no profiles`,
    );
  }

  return profile;
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
