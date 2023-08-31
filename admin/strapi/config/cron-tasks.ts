//

import type { Strapi } from "@strapi/strapi";
import { addMonths, compareAsc } from "date-fns";
import { z } from "zod";
import { GetValues } from "~/types";

//

export default {
  unconfirmed_user_cleanup: {
    task: unconfirmed_user_cleanup_task,
    options: {
      rule: "0 0 0 0 */1 *", // once each month
    },
  },
};

//

const isUser = (user: GetValues<"plugin::users-permissions.user">) =>
  z.object({ id: z.number(), updatedAt: z.coerce.date() }).parse(user);

async function unconfirmed_user_cleanup_task({ strapi }: { strapi: Strapi }) {
  const users = await strapi.entityService.findMany(
    "plugin::users-permissions.user",
    {
      filters: { confirmed: false },
    },
  );

  const inactive_user = users.map(isUser).filter(isInactiveSince6Months);

  for (const user of inactive_user) {
    console.info("Removing user ", user.id);
    console.debug(user);
    await strapi.entityService.delete(
      "plugin::users-permissions.user",
      user.id,
    );
  }
}

function isInactiveSince6Months({ updatedAt }) {
  // if a user is inactive after 6 month
  // if today is after the last update + 6 month
  compareAsc(new Date(), addMonths(new Date(updatedAt), 6)) > 0;
}
