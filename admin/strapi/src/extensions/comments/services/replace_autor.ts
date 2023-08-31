import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Comment } from "strapi-plugin-comments/types/contentTypes";
import { KoaContext, Next } from "~/types";

export async function replace_autor(body: Comment) {
  const { author } = body;
  const entityService: EntityService = strapi.entityService;
  if (!author) {
    strapi.log.warn(
      `extensions/comments/services::replate-author-by-profil detected no author.`,
    );
    return;
  }

  const { id: owner } = author;
  const profiles = await entityService.findMany(
    "api::user-profile.user-profile",
    {
      fields: ["id", "firstname", "lastname", "university"],
      filters: { owner: { id: owner } as any },
    },
  );

  if (!profiles || !profiles[0]) {
    strapi.log.warn(
      `extensions/comments/services::replate-author-by-profile detected no profiles.`,
    );
    return;
  }

  return {
    ...body,
    author: profiles[0],
  };
}

export function replate_each_body_data_author_by_profile() {
  return async function replate_each_body_data_author_by_profile(
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
  };
}
