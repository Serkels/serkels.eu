import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Context, Next } from "koa";
import { Comment } from "strapi-plugin-comments/types/contentTypes";

export default {
  routes: [
    {
      method: "GET",
      path: "/question/:id/answers/count",
      handler: "api::question.answers.count",
      config: {
        description: "Get question answers count",
        middlewares: [],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/:id/answers",
      handler: "api::question.answers.find",
      config: {
        description: "Get question answers",
        middlewares: [
          "api::question.relation",
          async function replate_author_by_profile(ctx: Context, next: Next) {
            await next();

            //

            console.log(ctx.body);
          },
        ],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/answers/:id",
      handler: "api::question.answers.findOne",
      config: {
        description: "Get one answer",
        middlewares: [
          "api::question.relation",
          async function replate_author_by_profile(ctx: Context, next: Next) {
            await next();

            //
            const { selected } = ctx.body as { selected: Comment };
            ctx.body = await replace_autor(selected);
          },
        ],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
    {
      method: "POST",
      path: "/question/:id/answers",
      handler: "api::question.answers.post",
      config: {
        description: "Get question answers",
        middlewares: [
          "api::question.relation",
          async function replate_author_by_profile(ctx: Context, next: Next) {
            await next();

            //

            console.log(ctx.body);
          },
        ],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
  ],
};

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
