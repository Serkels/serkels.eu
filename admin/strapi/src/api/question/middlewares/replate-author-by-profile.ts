//

import type { State } from "@/src/types";
import type { Next, ParameterizedContext } from "koa";
import type { Comment } from "strapi-plugin-comments/types/contentTypes";

export default (
  config: { keys_to_replace: string[] } = { keys_to_replace: ["data"] },
) => {
  return async function replate_author_by_profile(ctx: Context, next: Next) {
    await next();

    //
    console.log(ctx.body);
    console.log(ctx.body["data"]);
    ctx.body = ctx.body["data"]
      ? {
          data: await Promise.all(
            (ctx.body as { data: Comment[] }).data
              .map(replace_autor)
              .filter(Boolean),
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
      return;
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
      return;
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
