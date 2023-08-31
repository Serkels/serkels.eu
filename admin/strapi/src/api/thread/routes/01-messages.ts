//

import { errors } from "@strapi/utils";
import { z } from "zod";
import { replace_autor } from "~/src/extensions/comments/services/replace_autor";
import type {
  Comment,
  EntityService,
  GetValues,
  KoaContext,
  Next,
} from "~/types";

//

const { ValidationError } = errors;

//

export default {
  routes: [
    {
      method: "GET",
      path: "/thread/:id/messages",
      handler: "api::thread.messages.find",
      config: {
        description: "Get exchange deals",
        middlewares: ["api::thread.relation", replate_author_by_profile],
        policies: [],
      },
      info: { apiName: "api::thread.messages", type: "content-api" },
    },
    {
      method: "POST",
      path: "/thread/:id/messages",
      handler: "api::thread.messages.create",
      config: {
        description: "Get question answers",
        middlewares: [
          "api::thread.relation",
          clean_your_body,
          update_thread_last_message,
        ],
        policies: [],
      },
      info: { apiName: "api::thread.messages", type: "content-api" },
    },
  ],
};

//

async function update_thread_last_message(
  context: KoaContext<any, GetValues<"api::inbox.inbox">>,
  next: Next,
) {
  await next();

  //

  const thread_id = z.number().parse(context.params.id);
  const message = context.body;

  const entityService: EntityService = strapi.entityService;
  await entityService
    .update("api::thread.thread", thread_id, {
      data: {
        last_message: message.id,
      },
    })
    .then(() =>
      strapi.log.info(`UPDATE api::thread.thread ${thread_id}`, {
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

async function replate_author_by_profile(
  ctx: KoaContext<any, { data: Comment[] }>,
  next: Next,
) {
  await next();

  //

  const { data } = ctx.body;
  ctx.body = {
    ...ctx.body,
    data: await Promise.all(data.map(replace_autor)),
  };
}

//
