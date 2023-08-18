//

import type { Event } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import { UserEmitterMap } from "../../../../websocket";

//

const QUESTION_API_CONTENT_ID = "api::question.question";

//

export default {
  async afterDelete(event) {
    const result: Comment = event["result"];
    console.log({ event });
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

  async afterCreate(event) {
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
      related: {
        $eq: related,
      },
      blocked: {
        $eq: false,
      },
    },
  });
}
