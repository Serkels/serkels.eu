import { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { Comment } from "strapi-plugin-comments/types/contentTypes";

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
      filters: { owner },
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
