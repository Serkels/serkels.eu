/**
 * inbox service
 */

import { factories } from "@strapi/strapi";
import { z } from "zod";
import { GetValues, KoaContext } from "~/types";
import { INBOX_API_CONTENT_ID } from "../content-types/inbox";

export default factories.createCoreService("api::inbox.inbox");
export async function find_one_by_pair(filters: {
  owner_id: number;
  participant_id: number;
}) {
  const inboxes = await strapi.entityService.findMany("api::inbox.inbox", {
    filters: {
      $and: [
        { owner: { id: filters.owner_id } as any },
        { participant: { id: filters.participant_id } as any },
      ],
    },
  });

  const [inbox] = inboxes;
  if (Number.isNaN(inbox?.id)) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser([owner=${filters.owner_id},participant=${filters.participant_id}]): detected no inbox`,
    );
    return undefined;
  }

  return inbox;
}

export async function find_owner_inboxes(owner: number, ctx: KoaContext) {
  const inboxes = await strapi.entityService.findMany(INBOX_API_CONTENT_ID, {
    filters: { owner: { id: owner } },
    populate: {
      thread: { populate: ["last_message", "participants"] },
      participant: true,
    },
  });

  //

  return z
    .array(
      z
        .object({
          id: z.number(),
        })
        .passthrough(),
    )
    .parse(inboxes, { path: ["inboxes"] }) as GetValues<
    typeof INBOX_API_CONTENT_ID
  >[];
}
