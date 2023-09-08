/**
 * partner service
 */

import { factories } from "@strapi/strapi";
import { z } from "zod";

export default factories.createCoreService("api::partner.partner");

export async function findOneFromUser(id: number) {
  const profiles = await strapi.entityService.findMany("api::partner.partner", {
    filters: { owner: { id } as any },
  });

  const assertion = z
    .array(z.object({ id: z.number() }))
    .length(1, "Only one partner should be found")
    .safeParse(profiles);

  if (!assertion.success) {
    strapi.log.warn(
      `service::partner.partner > ` +
        `findOneFromUser(${id}): detected no partner`,
    );
    return undefined;
  }

  return profiles[0];
}
