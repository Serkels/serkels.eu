//

import type { Next, ParameterizedContext } from "koa";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";
import type { State } from "../../../types";

export default (config: { many: (ctx: object) => any[] }) => {
  return async function replate_author_by_profile(ctx: Context, next: Next) {
    await next();

    //

    ctx.body = ctx.body["data"]
      ? {
          data: await Promise.all(
            (ctx.body as { data: Comment[] }).data.map(replace_autor),
          ),
        }
      : await replace_autor(ctx.body as Comment);
  };

  async function replace_autor(body: Comment) {
    const { author } = body;
    if (!author) {
      strapi.log.warn(
        `api::question.replate-author-by-profile middlewares detected no author.`,
      );
    }

    const { id: owner } = author;
    const profiles = await strapi.entityService.findMany(
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
    }

    return {
      ...body,
      author: profiles[0],
    };
  }
};

type Context = ParameterizedContext<
  State,
  {
    params?: {
      id?: string;
      relation?: string;
    };
  },
  { data: Comment[] } | Comment
>;
