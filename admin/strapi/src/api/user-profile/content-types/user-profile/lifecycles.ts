//
import type { Event as LifecycleEvent } from "@strapi/database/lib/lifecycles";
import type { Common } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { GetValues } from "~/types";

//

const PROFILE_API_CONTENT_ID =
  "api::user-profile.user-profile" as const satisfies Common.UID.ContentType;
const BOOKMARK_API_CONTENT_ID =
  "api::bookmark.bookmark" as const satisfies Common.UID.ContentType;

//

export default {
  async beforeCreate(event: LifecycleEvent) {
    // const { action, model, params } = event;
    // console.log(__dirname, { action, model, params });
    // event.params.data.publishedAt = null
    // event.params.data.status = null
  },
  async afterCreate(event: LifecycleEvent) {
    // const { action, model, params } = event;
    // console.log(__dirname, { action, model, params });
  },
  async beforeUpdate(event: LifecycleEvent) {
    // const { action, model, params } = event;
    // console.log(__dirname, { action, model, params });
  },
  async afterUpdate(event: LifecycleEvent) {
    // const { action, model, params } = event;
    // console.log(__dirname, { action, model, params });
  },
  async beforeDelete(event: LifecycleEvent) {
    const { model, params } = event;

    const entry: GetValues<typeof PROFILE_API_CONTENT_ID> & { id: number } =
      await strapi.db
        .query(model.uid)
        .findOne({ ...params, populate: ["owner", "image"] });

    await Promise.all([
      remove_profile_image(entry.image),
      remove_profile_bookmarks(entry),
    ]);

    await remove_profile_owner(entry.owner);
  },
  async afterDelete(event: LifecycleEvent) {
    const { action, model, params } = event;
    console.log(__dirname, { action, model, params });
  },
};

//

async function remove_profile_image(
  image: GetValues<typeof PROFILE_API_CONTENT_ID>["image"] | null,
) {
  if (!image) {
    return;
  }

  strapi.log.warn(`${__filename} : TODO remove the image from AWS`, image);
}

async function remove_profile_bookmarks(
  profile: GetValues<typeof PROFILE_API_CONTENT_ID>,
) {
  const entityService: EntityService = strapi.entityService;
  const { owner } = profile;

  const bookmarks = await entityService.findMany(BOOKMARK_API_CONTENT_ID, {
    filters: {
      owner: { id: owner } as any,
    },
  });

  await Promise.all(
    // Remove all owned bookmarks
    bookmarks.map(({ id }) =>
      entityService
        .delete(BOOKMARK_API_CONTENT_ID, id, {})
        .then(() => strapi.log.info(`DELETE ${BOOKMARK_API_CONTENT_ID} ${id}`)),
    ),
  );
}

async function remove_profile_owner(
  owner: GetValues<typeof PROFILE_API_CONTENT_ID>["owner"] | null,
) {
  if (!owner) {
    return;
  }

  const { id } = owner as GetValues<typeof PROFILE_API_CONTENT_ID>["owner"] & {
    id: number;
  };

  strapi.log.warn(`${__filename} : TODO remove the profile`, owner, id);
}
