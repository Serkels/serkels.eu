//

import type { Event as LifecycleEvent } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { Shared } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import { ApiExchangeDealExchangeDeal } from "~/types/generated/contentTypes";

//

type ParamsWhere = { params: { where: { id: number } } };

export default {
  async beforeDelete(event: LifecycleEvent & ParamsWhere) {
    const entityService: EntityService = strapi.entityService;
    const { model, params } = event;

    const entry: ApiExchangeDealExchangeDeal["attributes"] & { id: number } =
      await strapi.db
        .query(model.uid)
        .findOne({ ...params, populate: ["owner"] });

    const comments = await entityService.findMany<
      keyof Shared.ContentTypes,
      Comment
    >("plugin::comments.comment", {
      filters: { related: { uid: model.uid, id: entry.id } },
    });

    await Promise.all(
      comments.map(({ id }) =>
        entityService
          .delete<keyof Shared.ContentTypes, unknown>(
            "plugin::comments.comment",
            id,
            {},
          )
          .then(() => strapi.log.info(`DELETE plugin::comments.comment ${id}`)),
      ),
    );
  },
} as Subscriber;
