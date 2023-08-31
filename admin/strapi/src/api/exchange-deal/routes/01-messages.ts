//

import { errors } from "@strapi/utils";
import { replate_each_body_data_author_by_profile } from "~/src/extensions/comments/services/replace_autor";
import type { Comment, KoaContext, Next } from "~/types";

//

const { ValidationError } = errors;

//

export default {
  routes: [
    {
      method: "GET",
      path: "/deals/:id/messages",
      handler: "api::exchange-deal.messages.find",
      config: {
        description: "Get exchange deals",
        middlewares: [
          "api::exchange-deal.relation",
          replate_each_body_data_author_by_profile(),
        ],
        policies: [],
      },
      info: { apiName: "api::exchange-deal.messages", type: "content-api" },
    },
    {
      method: "POST",
      path: "/deals/:id/messages",
      handler: "api::exchange-deal.messages.create",
      config: {
        description: "Get question answers",
        middlewares: [
          "api::exchange-deal.relation",
          clean_your_body,
          update_deal_last_message,
        ],
        policies: [],
      },
      info: { apiName: "api::exchange-deal.messages", type: "content-api" },
    },
  ],
};

//

async function update_deal_last_message(
  context: KoaContext<any, Comment>,
  next: Next,
) {
  await next();

  //

  const deal_id = context.params.id;
  const message = context.body;

  await strapi.entityService
    .update("api::exchange-deal.exchange-deal", deal_id, {
      data: {
        last_message: Number(message.id),
      },
    })
    .then(() =>
      strapi.log.info(`UPDATE api::exchange-deal.exchange-deal ${deal_id}`, {
        last_message: message.id,
      }),
    );
}

async function clean_your_body(
  ctx: KoaContext<Partial<Pick<Comment, "content">>>,
  next: Next,
) {
  const data = ctx.request.body;

  if (!data) {
    throw new ValidationError("Empty body data", ctx.request.body);
  }
  if (!data.content) {
    throw new ValidationError("Empty message content", ctx.request.body);
  }

  ctx.request.body = { content: data.content };

  await next();
}

//
