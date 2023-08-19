import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Context, Next } from "koa";
import { Comment } from "strapi-plugin-comments/types/contentTypes";

export default {
  routes: [
    {
      method: "GET",
      path: "/answer/:id",
      handler: "api::question.answer.findOne",
      config: {
        description: "Get one answer",
        middlewares: [
          "api::question.relation",
          replate_selected_author_by_profile,
        ],
        policies: [],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
    {
      method: "DELETE",
      path: "/answer/:id",
      handler: "api::question.answer.delete",
      config: {
        description: "Delete one answer",
        middlewares: [],
        policies: [
          {
            name: "global::is-owned",
            config: {
              apiName: "comment",
              controllerName: "plugin::comments",
              entryName: "authorUser",
            },
          },
        ],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/:id/answers/count",
      handler: "api::question.answer.count",
      config: {
        description: "Get question answers count",
        middlewares: [],
        policies: [],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/:id/answers",
      handler: "api::question.answer.find",
      config: {
        description: "Get question answers",
        middlewares: [
          "api::question.relation",
          async function replate_author_by_profile(ctx: Context, next: Next) {
            await next();

            //

            const { data } = ctx.body as { data: Comment[] };
            ctx.body = { data: await Promise.all(data.map(replace_autor)) };
          },
        ],
        policies: [],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
    {
      method: "POST",
      path: "/question/:id/answers",
      handler: "api::question.answer.post",
      config: {
        description: "Get question answers",
        middlewares: ["api::question.relation", clean_your_body],
        policies: [],
      },
      info: { apiName: "api::question.answer", type: "content-api" },
    },
  ],
};

//

async function clean_your_body(
  ctx: Context & {
    request: {
      body: Comment;
    };
  },
  next: Next,
) {
  const data = ctx.request.body;

  if (!data) {
    ctx.noContent("Missing request body");
    return next();
  }
  if (!data.content) {
    ctx.noContent("Missing comment content");
    return next();
  }

  ctx.request.body = { content: data.content } as Comment;

  await next();
}

async function replace_autor(body: Comment) {
  const { author } = body;
  const entityService: EntityService = strapi.entityService;
  if (!author) {
    strapi.log.warn(
      `api::question.replate-author-by-profile middlewares detected no author.`,
    );
    return;
  }

  const { id: owner } = author;
  const profiles = await entityService.findMany(
    "api::user-profile.user-profile",
    {
      fields: ["id", "firstname", "lastname", "university"],
      filters: { owner },
    },
  );

  if (!profiles || !profiles[0]) {
    strapi.log.warn(
      `api::question.replate-author-by-profile middlewares detected no profiles.`,
    );
    return;
  }

  return {
    ...body,
    author: profiles[0],
  };
}

//
async function replate_selected_author_by_profile(ctx: Context, next: Next) {
  await next();

  //

  const { selected } = ctx.body as { selected: Comment };
  ctx.body = await replace_autor(selected);
}
