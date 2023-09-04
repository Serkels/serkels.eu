/**
 * user-profile service
 */

import { factories } from "@strapi/strapi";
import { createHash } from "node:crypto";
import { z } from "zod";

export default factories.createCoreService(
  "api::user-profile.user-profile",
  () => ({
    gravatarUrlFor,
    async findOneFromUser(user_id: number) {
      const profile = await findOneFromUser(user_id);
      return super.findOne(profile?.id);
    },
  }),
);

//

export async function findRelatedUser(id: number) {
  const profile = await strapi.entityService.findOne(
    "api::user-profile.user-profile",
    id,
    { populate: ["owner"] },
  );

  return { id: NaN, ...profile.owner };
}

export async function findOneFromUser(id: number) {
  const profiles = await strapi.entityService.findMany(
    "api::user-profile.user-profile",
    {
      filters: { owner: { id } as any },
    },
  );

  const assertion = z
    .array(z.object({ id: z.number() }))
    .length(1, "Only one profile should be found")
    .safeParse(profiles);

  if (!assertion.success) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser(${id}): detected no profiles`,
    );
    return undefined;
  }

  return profiles[0];
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
