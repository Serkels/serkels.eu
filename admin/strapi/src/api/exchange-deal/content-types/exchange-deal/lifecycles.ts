//

import type { Event as LifecycleEvent } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";

//

type ParamsWhere = { params: { where: { id: number } } };

export default {
  async beforeDelete(event: LifecycleEvent & ParamsWhere) {
    const { params } = event;

    const relation = `api::exchange-deal.exchange-deal:${params.where.id}`;
    const comments = await strapi.entityService.findMany(
      "plugin::comments.comment",
      {
        populate: [],
        filters: { related: relation },
      },
    );

    for (const comment of comments) {
      await strapi.entityService.delete(
        "plugin::comments.comment",
        comment.id,
        {},
      );

      strapi.log.info(
        `unconfirmed_user_cleanup_task > ` +
          `DELETE plugin::comments.comment:${comment.id} ` +
          `{related: ${comment.related}}`,
      );
    }
  },
} as Subscriber;
