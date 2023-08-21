//

import type { Event } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { Common } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import { UserEmitterMap } from "../../../../websocket";

//

const QUESTION_API_CONTENT_ID: Common.UID.ContentType =
  "api::question.question" as const;

//

export default {
  async afterDelete(event) {
    const {
      log: { debug },
    } = strapi;
    debug(`${event.model.uid} ${event.action}`);

    const result: Comment = event["result"];
    const related: string = result.related;

    const entityService: EntityService = strapi.entityService;
    if (!related.startsWith(QUESTION_API_CONTENT_ID)) {
      return;
    }

    const answer_count = await count_related_comments(event);

    const question_id = Number(
      related.replace(`${QUESTION_API_CONTENT_ID}:`, ""),
    );
    if (Number.isNaN(question_id)) {
      strapi.log.warn(`${__filename} : question_id of ${related} is NaN`);
      return;
    }

    await entityService
      .update("api::question.question", question_id, {
        data: <GetValues<"api::question.question">>{
          answer_count,
          last_activity: new Date().toISOString(),
        },
      })
      .then(() =>
        strapi.log.info(`UPDATE api::question.question ${question_id}`, {
          answer_count,
        }),
      );
  },

  //

  async afterUpdate(event) {
    const {
      log: { debug },
    } = strapi;
    debug(`${event.model.uid} ${event.action}`);
    return this.afterDelete(event);
  },

  //

  async afterCreate(event) {
    const {
      log: { debug },
    } = strapi;
    debug(`${event.model.uid} ${event.action}`);

    const result: Comment = event["result"];
    const related: string = result.related;
    const entityService: EntityService = strapi.entityService;

    if (!related.startsWith(QUESTION_API_CONTENT_ID)) {
      return;
    }

    const question_id = Number(
      related.replace(`${QUESTION_API_CONTENT_ID}:`, ""),
    );

    if (Number.isNaN(question_id)) {
      strapi.log.warn(`${__filename} : question_id of ${related} is NaN`);
      return;
    }

    //

    const answer_count = await count_related_comments(event);
    await entityService
      .update<"api::question.question", GetValues<"api::question.question">>(
        "api::question.question",
        question_id,
        {
          data: <GetValues<"api::question.question">>{
            answer_count,
            last_activity: new Date().toISOString(),
          },
        },
      )
      .then(() =>
        strapi.log.info(`UPDATE api::question.question ${question_id}`, {
          answer_count,
        }),
      );

    //

    const had_listeners = UserEmitterMap.get(question_id).notifications.emit(
      "new_answer",
      Number(result.authorId),
    );
    if (had_listeners) {
      strapi.log.info(`EMIT notifications.new_answer ${result.authorId}`);
    }
  },
} as Subscriber;

//

async function count_related_comments(event: Event): Promise<number> {
  const entityService: EntityService = strapi.entityService;
  const result: Comment = event["result"];
  const related: string = result.related;

  const {
    model: { uid },
  } = event;

  return entityService.count(uid, {
    filters: {
      removed: {
        $null: true,
      },
      related: {
        $eq: related,
      },
      blocked: {
        $eq: false,
      },
    },
  });
}
