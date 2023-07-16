//

import type { Strapi } from "@strapi/strapi";
import { addMonths, compareAsc } from "date-fns";

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

async function unconfirmed_user_cleanup_task({ strapi }: { strapi: Strapi }) {
  const users: { id: string; updatedAt: string }[] =
    await strapi.entityService.findMany("plugin::users-permissions.user", {
      filters: { confirmed: false },
    });

  const inactive_user = users.filter(isInactiveSince6Months);

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
