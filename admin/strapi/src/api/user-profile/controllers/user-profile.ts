/**
 * user-profile controller
 */

import { factories } from "@strapi/strapi";
import etag from "etag";
import { Response } from "koa";
import { lookup } from "mime-types";
import { pipeline } from "undici";
import { StrapiContext } from "../../../types";

export default factories.createCoreController(
  "api::user-profile.user-profile",
  ({ strapi }) => ({
    async me(ctx) {
      const user: { id: number } = ctx.state.user;
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };

      ctx.query.populate = {
        bookmarks: {
          fields: ["slug"],
        },
        image: {
          fields: ["url"],
        },
        owner: {
          fields: ["email", "username"],
        },
      };

      const { data } = await super.find(ctx);

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      return { data: profile, meta: {} };
    },

    async me_update(ctx) {
      const user: { id: number } = ctx.state.user;

      ctx.query.filters = {
        owner: user.id,
      };
      const { data } = await super.find(ctx);
      const profile = data[0];

      if (profile) {
        ctx.params.id = profile.id;
        return super.update(ctx);
      }

      ctx.request.body.data.owner = user.id;
      return super.create(ctx);
    },

    async findOne(ctx) {
      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
      };
      return super.findOne(ctx);
    },

    async avatar(ctx: StrapiContext) {
      const profile = await strapi.entityService.findOne(
        "api::user-profile.user-profile",
        ctx.params.id,
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

      (ctx as any).body = ctx.req.pipe(
        pipeline(
          url,
          { method: ctx.method as "GET", opaque: ctx.response },
          ({ statusCode, headers, body, opaque }) => {
            (opaque as Response).status = statusCode;
            const mimeType = lookup(url) || "image/png";
            ctx.response.set("content-type", mimeType);
            ctx.response.set("cache-control", "max-age=300");
            ctx.response.set("ETag", etag(url));
            return body;
          },
        ),
      );
    },

    async findOneByUser(ctx) {
      console.log();
      console.log("findOneByUser");
      const user: { id: number } = ctx.params;
      console.log({ user });

      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        owner: user.id,
      };

      ctx.query.populate = {
        image: {
          fields: ["url"],
        },
      };

      const { data } = await super.find(ctx);
      console.log({ data });

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      console.log();
      return { data: profile, meta: {} };
    },
  }),
);
