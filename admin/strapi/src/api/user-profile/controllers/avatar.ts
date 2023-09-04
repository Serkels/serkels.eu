/**
 * user-profile controller
 */

import etag from "etag";
import { ExtendableContext, Response } from "koa";
import { lookup } from "mime-types";
import ms from "ms";
import { StrapiRequestContext } from "strapi-typed";
import { pipeline } from "undici";

export default {
  async find_by_profile_id(ctx: StrapiRequestContext) {
    const id = Number(ctx.params.id);
    if (Number.isNaN(id)) return ctx.notFound("Profile not found");

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

    if (!profile) return ctx.notFound("Profile not found");
    const { image, owner } = profile;

    const url =
      image?.url ??
      (await (async () => {
        const user = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          owner.id,
        );

        if (!user) return ctx.notFound("User not found");
        const { email } = user;

        return strapi
          .service("api::user-profile.user-profile")
          .gravatarUrlFor(email);
      })());

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
