/**
 * user-profile controller
 */

import etag from "etag";
import { ExtendableContext, Response } from "koa";
import { lookup } from "mime-types";
import ms from "ms";
import { StrapiRequestContext } from "strapi-typed";
import { pipeline } from "undici";

// TODO(douglasduteil): ask the database for the default image
const UNKNOWN_USER_AVATAR =
  "https://cdn-media-toctoc.s3.eu-west-3.amazonaws.com/unknown_user_15e2c74856.png" as const;

export default {
  async find_by_profile_id(ctx: StrapiRequestContext) {
    let url = UNKNOWN_USER_AVATAR;

    try {
      const id = Number(ctx.params.id);
      if (Number.isNaN(id)) throw new Error("Id not found");

      const profile = await strapi.entityService.findOne(
        "api::user-profile.user-profile",
        id,
        {
          populate: {
            owner: {
              fields: ["email"],
            },
            image: {
              fields: ["url"],
            },
          },
        },
      );

      if (!profile) throw new Error("Profile not found");
      const { image, owner } = profile;

      if (image?.url) {
        url = image?.url;
      } else {
        url = UNKNOWN_USER_AVATAR;

        const user = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          owner.id,
        );

        if (!user) throw new Error("User not found");
        const { email } = user;

        url = strapi
          .service("api::user-profile.user-profile")
          .gravatarUrlFor(email);
      }
    } catch {}

    const koa_ctx = ctx as any as ExtendableContext;
    (ctx as any).body = koa_ctx.req.pipe(
      pipeline(
        url,
        { method: koa_ctx.method as "GET", opaque: koa_ctx.response },
        ({ statusCode, headers, body, opaque }) => {
          (opaque as Response).status = statusCode;
          const mimeType = lookup(url) || "image/png";
          koa_ctx.response.set("content-type", mimeType);
          koa_ctx.response.set("cache-control", "s-maxage=" + ms("5min"));
          koa_ctx.response.set("ETag", etag(url));
          return body;
        },
      ),
    );
  },
};
