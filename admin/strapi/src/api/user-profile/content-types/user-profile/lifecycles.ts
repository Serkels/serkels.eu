//
import {
  ApiBookmarkBookmark,
  ApiUserProfileUserProfile,
} from "@/types/generated/contentTypes";
import type { Event as LifecycleEvent } from "@strapi/database/lib/lifecycles";
import type { Shared } from "@strapi/strapi";
import type { EntityService } from "@strapi/strapi/lib/services/entity-service";

//

type ParamsWhere = { params: { where: { id: number } } };

export default {
  async beforeCreate(event: LifecycleEvent & ParamsWhere) {
    const { action, model, params } = event;
    console.log(__dirname, { action, model, params });
    // event.params.data.publishedAt = null
    // event.params.data.status = null
  },
  async afterCreate(event: LifecycleEvent) {
    const { action, model, params } = event;
    console.log(__dirname, { action, model, params });
  },
  async beforeUpdate(event: LifecycleEvent) {
    const { action, model, params } = event;
    console.log(__dirname, { action, model, params });
  },
  async afterUpdate(event: LifecycleEvent) {
    const { action, model, params } = event;
    console.log(__dirname, { action, model, params });
  },
  async beforeDelete(event: LifecycleEvent & ParamsWhere) {
    const { model, params } = event;

    const entry: ApiUserProfileUserProfile["attributes"] & { id: number } =
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
  image: ApiUserProfileUserProfile["attributes"]["image"] | null,
) {
  if (!image) {
    return;
  }

  strapi.log.warn(`${__filename} : TODO remove the image from AWS`, image);
}

async function remove_profile_bookmarks(
  profile: ApiUserProfileUserProfile["attributes"],
) {
  const entityService: EntityService = strapi.entityService;
  const { owner } = profile as ApiUserProfileUserProfile["attributes"] & {
    id: number;
  };

  const bookmarks = await entityService.findMany<
    keyof Shared.ContentTypes,
    ApiBookmarkBookmark["attributes"] & { id: number }
  >("api::bookmark.bookmark", {
    filters: {
      owner: owner["id"],
    },
  });

  await Promise.all(
    // Remove all owned bookmarks
    bookmarks.map(({ id }) =>
      entityService
        .delete<keyof Shared.ContentTypes, ApiBookmarkBookmark["attributes"]>(
          "api::bookmark.bookmark",
          id,
          {},
        )
        .then(() => strapi.log.info(`DELETE api::bookmark.bookmark ${id}`)),
    ),
  );
}

async function remove_profile_owner(
  owner: ApiUserProfileUserProfile["attributes"]["owner"] | null,
) {
  if (!owner) {
    return;
  }
  const { id } = owner as ApiUserProfileUserProfile["attributes"]["owner"] & {
    id: number;
  };

  strapi.log.warn(`${__filename} : TODO remove the profile`, owner, id);
}
