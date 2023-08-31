//

import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { Shared } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type {
  BeforeCreateLifecycleEvent,
  BeforeDeleteLifecycleEvent,
  GetValues,
} from "~/types";
import type { ApiQuestionQuestion } from "~/types/generated/contentTypes";

//

type ParamsWhere = { params: { where: { id: number } } };

export default {
  async beforeCreate(
    event: BeforeCreateLifecycleEvent<GetValues<"api::question.question">>,
  ) {
    strapi.log.debug(`${event.action} ${event.model.uid}`);
    const { params } = event;
    params.data.edited_at = params.data.createdAt;
  },

  async beforeDelete(event: BeforeDeleteLifecycleEvent) {
    strapi.log.debug(`${event.action} ${event.model.uid}`);

    const entityService: EntityService = strapi.entityService;
    const { model, params } = event;

    const entry: ApiQuestionQuestion["attributes"] & { id: number } =
      await strapi.db
        .query(model.uid)
        .findOne({ where: params.where, populate: ["owner"] });

    strapi.log.debug(`${event.action} ${event.model.uid}:${entry.id}`);

    // const comments = await strapi.plugin("comments").service("common").findRelatedEntitiesFor;
    const comments = await entityService.findMany("plugin::comments.comment", {
      filters: { related: `${model.uid}:${entry.id}` },
    });
    strapi.log.debug(
      `${event.action} found ${comments.length} comments related to ${event.model.uid}::${entry.id}`,
    );

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
