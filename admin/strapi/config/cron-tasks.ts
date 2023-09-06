//

import type { Strapi } from "@strapi/strapi";
import { DateTimeValue } from "@strapi/strapi/lib/types/core/attributes";
import { addMonths, addWeeks, compareAsc } from "date-fns";
import type { GetValues } from "~/types";

//

const once_a_month = {
  rule: "0 0 0 0 */1 *", // once each month
  tz: "Europe/Paris",
};

const every_monday_at_1am = {
  rule: "0 0 1 * * 1", // once each month
  tz: "Europe/Paris",
};

export default {
  unconfirmed_user_cleanup: {
    task: unconfirmed_user_cleanup_task,
    options: once_a_month,
  },
  outdated_token_cleanup: {
    task: outdated_token_cleanup_task,
    options: once_a_month,
  },
  inactive_token_cleanup: {
    task: inactive_token_cleanup_task,
    options: every_monday_at_1am,
  },
  outdated_media_cleanup: {
    task: outdated_media_cleanup,
    options: once_a_month,
  },
};

//

async function unconfirmed_user_cleanup_task({ strapi }: { strapi: Strapi }) {
  strapi.log.info("< unconfirmed_user_cleanup_task >");

  const user_active_since_last_6_mouth = ({
    updatedAt,
  }: {
    updatedAt?: DateTimeValue;
  }) =>
    // if a user is inactive after 6 months
    // if today is after the last update + 6 months
    compareAsc(new Date(), addMonths(new Date(updatedAt), 6)) > 0;

  try {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: { confirmed: false },
      },
    );

    for (const user of users) {
      if (user_active_since_last_6_mouth(user)) continue;

      await strapi.entityService.delete(
        "plugin::users-permissions.user",
        user.id,
      );

      strapi.log.info(
        `unconfirmed_user_cleanup_task > ` +
          `DELETE plugin::users-permissions.user:${user.id} ` +
          `{email: ${user.email}}`,
      );
    }
  } catch (error) {
    strapi.log.error(error);
  }
  strapi.log.info("</ unconfirmed_user_cleanup_task >");
}

async function outdated_token_cleanup_task({ strapi }: { strapi: Strapi }) {
  strapi.log.info("< outdated_token_cleanup_task >");

  const token_active_since_last_week = ({
    updatedAt,
  }: {
    updatedAt?: DateTimeValue;
  }) =>
    // if a user is inactive after 1 week
    // if today is after the last update + 1 week
    compareAsc(new Date(), addWeeks(new Date(updatedAt), 1)) > 0;

  try {
    const tokens = await strapi.entityService.findMany(
      "plugin::passwordless.token",
      {
        filters: { login_date: { $null: true } },
      },
    );

    for (const token of tokens) {
      if (token_active_since_last_week(token)) continue;

      await strapi.entityService.delete("plugin::passwordless.token", token.id);

      strapi.log.info(
        `outdated_token_cleanup_task > ` +
          `DELETE plugin::passwordless.token:${token.id} ` +
          `{email: ${token.email}}`,
      );
    }
  } catch (error) {
    strapi.log.error(error);
  }
  strapi.log.info("</ outdated_token_cleanup_task >");
}

async function outdated_media_cleanup({ strapi }: { strapi: Strapi }) {
  strapi.log.info("< outdated_media_cleanup >");

  try {
    const profiles = await strapi.entityService.findMany(
      "api::user-profile.user-profile",
      {
        fields: ["id"],
        populate: ["image"],
        // filters: {image: {}} // TODO(douglasduteil): pre filter not null profile.image
      },
    );

    const exclude_image_ids = profiles
      .map(
        (profile) => profile.image as GetValues<"plugin::upload.file"> | null,
      )
      .map((image) => image?.id)
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    const folders = await strapi.entityService.findMany(
      "plugin::upload.folder",
      { fields: ["path"] },
    );
    const folder_paths = folders.map((folder) => folder.path);

    const images = await strapi.entityService.findMany("plugin::upload.file", {
      fields: ["id", "folderPath", "name"],
      filters: {
        folderPath: { $in: folder_paths },
        $not: { id: { $in: exclude_image_ids } } as any,
      },
    });

    for (const image of images) {
      await strapi.entityService.delete("plugin::upload.file", image.id);
      strapi.log.info(
        `outdated_media_cleanup > ` +
          `DELETE plugin::upload.file:${image.id} ` +
          `{folderPath: ${image.folderPath}, name: ${image.name}}`,
      );
    }
  } catch (error) {
    strapi.log.error(error);
  }
  strapi.log.info("</ outdated_media_cleanup >");
}

async function inactive_token_cleanup_task({ strapi }: { strapi: Strapi }) {
  strapi.log.info("< inactive_token_cleanup_task >");

  const token_active_since_last_week = ({
    updatedAt,
  }: {
    updatedAt?: DateTimeValue;
  }) =>
    // if a user is inactive after 1 week
    // if today is after the last update + 1 week
    compareAsc(new Date(), addWeeks(new Date(updatedAt), 1)) > 0;

  try {
    const tokens = await strapi.entityService.findMany(
      "plugin::passwordless.token",
      {
        filters: { is_active: { $eq: false } },
      },
    );

    for (const token of tokens) {
      if (token_active_since_last_week(token)) continue;

      await strapi.entityService.delete("plugin::passwordless.token", token.id);

      strapi.log.info(
        `inactive_token_cleanup_task > ` +
          `DELETE plugin::passwordless.token:${token.id} ` +
          `{email: ${token.email}}`,
      );
    }
  } catch (error) {
    strapi.log.error(error);
  }
  strapi.log.info("</ inactive_token_cleanup_task >");
}
