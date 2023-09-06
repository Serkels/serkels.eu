/**
 * inbox service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::inbox.inbox");
export async function find_one_by_pair(filters: {
  owner_id: number;
  participant_id: number;
}) {
  const inboxes = await strapi.entityService.findMany("api::inbox.inbox", {
    filters: {
      $or: [
        { owner: { id: filters.owner_id } as any },
        { participant: { id: filters.participant_id } as any },
      ],
    },
  });

  const [inbox] = inboxes;
  if (Number.isNaN(inbox.id)) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser([owner=${filters.owner_id},participant=${filters.participant_id}]): detected no inbox`,
    );
    return undefined;
  }

  return inbox;
}
