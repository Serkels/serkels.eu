//

import type { Event } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
import { ValidationError } from "@strapi/utils/dist/errors";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import { UserEmitterMap } from "~/src/websocket";
import type { AfterCreateLifecycleEvent } from "~/types";

//

const QUESTION_API_CONTENT_ID = "api::question.question" as const;

//

export default {
  async afterDelete(event) {
    strapi.log.debug(`${event.action} ${event.model.uid}`);
    await Promise.all([update_answer_count_of_related_quetion(event)]);
  },

  //

  async afterUpdate(event) {
    strapi.log.debug(`${event.action} ${event.model.uid}`);
    return this.afterDelete(event);
  },

  //

  async afterCreate(event) {
    strapi.log.debug(`${event.action} ${event.model.uid}`);

    await Promise.all([
      update_answer_count_of_related_quetion(event),
      notify_new_anwser_to_quetion_owner(event),
    ]);
  },
} as Subscriber;

//

async function notify_new_anwser_to_quetion_owner(event: Event) {
  const { result } = event as AfterCreateLifecycleEvent<
    { data: GetValues<"plugin::comments.comment"> },
    GetValues<"plugin::comments.comment"> & { id: number }
  >;

  const related: string = result.related;
  if (!related.startsWith(QUESTION_API_CONTENT_ID)) {
    return;
  }
  strapi.log.debug(`(notify_new_anwser_to_quetion_owner)`);

  const question_id = parse_question_id(event);
  const entityService: EntityService = strapi.entityService;
  const question = await entityService.findOne(
    QUESTION_API_CONTENT_ID,
    question_id,
    {
      populate: "*",
    },
  );

  const had_listeners = UserEmitterMap.get(
    Number(question.owner.id),
  ).notifications.emit("new_answer", Number(result.id));
  if (had_listeners) {
    strapi.log.info(
      `${event.action} ${event.model.uid} > ` +
        `EMIT notifications.new_answer (comment_id ${result.id})`,
    );
  }
}

async function update_answer_count_of_related_quetion(event: Event) {
  const result: Comment = event["result"];
  const related: string = result.related;
  if (!related.startsWith(QUESTION_API_CONTENT_ID)) {
    return;
  }
  strapi.log.debug(`(update_answer_count_of_related_quetion)`);

  const question_id = parse_question_id(event);
  const answer_count = await count_related_comments(related);

  await strapi.entityService.update(QUESTION_API_CONTENT_ID, question_id, {
    data: {
      answer_count,
      last_activity: new Date().toISOString(),
    },
  });

  strapi.log.info(
    `${event.action} ${event.model.uid} > ` +
      `UPDATE ${QUESTION_API_CONTENT_ID} ${question_id} ` +
      `{answer_count: ${answer_count}}`,
  );
}

//

function parse_question_id(event: Event) {
  const result: Comment = event["result"];
  const related: string = result.related;
  const question_id = Number(
    related.replace(`${QUESTION_API_CONTENT_ID}:`, ""),
  );

  if (Number.isNaN(question_id)) {
    throw new ValidationError(
      `${event.action} ${event.model.uid} : ` +
        `question_id of ${related} is NaN`,
    );
  }

  return question_id;
}

async function count_related_comments(related: string): Promise<number> {
  const entityService: EntityService = strapi.entityService;

  return entityService.count("plugin::comments.comment", {
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
