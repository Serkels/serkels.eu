//

import type { Event } from "@strapi/database/lib/lifecycles";
import type { Subscriber } from "@strapi/database/lib/lifecycles/subscribers";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";

//

const QUESTION_API_CONTENT_ID = "api::question.question";

//

export default {
  async afterUpdate(event) {
    const result: Comment = event["result"];
    const related: string = result.related;
    if (!related.startsWith(QUESTION_API_CONTENT_ID)) {
      return;
    }

    const answer_count = await count_related_comments(event);

    const question_id = Number(
      related.replace(`${QUESTION_API_CONTENT_ID}:`, ""),
    );
    if (Number.isNaN(question_id)) {
      strapi.log.warn(
        `extensions/comments/content-types/comment/lifecycles.ts : question_id of ${related} is NaN`,
      );
      return;
    }

    await strapi.entityService.update("api::question.question", question_id, {
      data: {
        answer_count,
      },
    });
  },
  async afterCreate(event) {
    const result: Comment = event["result"];
    const { params } = event;
    const { where, data } = params;
    console.log();
    console.log("---");
    console.log("afterCreate");
    console.log({ event, params });
    console.log({ where, data });
    console.log({ result });
    console.trace();
    console.log();
  },
  async afterDelete(event) {
    const result: Comment = event["result"];
    const { params } = event;
    console.log();
    console.log("---");
    console.log("afterDelete");
    console.log({ event });
    console.log({ params });
    console.log({ result });
    console.trace();
    console.log();
  },
} as Subscriber;

//

async function count_related_comments(event: Event): Promise<number> {
  const result: Comment = event["result"];
  const related: string = result.related;

  const {
    model: { uid },
  } = event;

  return strapi.entityService.count(uid, {
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
