/**
 * user-profile controller
 */

import { factories } from "@strapi/strapi";
import etag from "etag";
import { ExtendableContext, Response } from "koa";
import { lookup } from "mime-types";
import { StrapiRequestContext } from "strapi-typed";
import { pipeline } from "undici";

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

    async avatar(ctx: StrapiRequestContext) {
      const id = Number(ctx.params.id);
      if (Number.isNaN(id)) return ctx.notFound("Profile not found");

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

      const koa_ctx = ctx as any as ExtendableContext;
      (ctx as any).body = koa_ctx.req.pipe(
        pipeline(
          url,
          { method: koa_ctx.method as "GET", opaque: koa_ctx.response },
          ({ statusCode, headers, body, opaque }) => {
            (opaque as Response).status = statusCode;
            const mimeType = lookup(url) || "image/png";
            koa_ctx.response.set("content-type", mimeType);
            koa_ctx.response.set("cache-control", "max-age=300");
            koa_ctx.response.set("ETag", etag(url));
            return body;
          },
        ),
      );
    },

    async findOneByUser(ctx) {
      const user: { id: number } = ctx.params;

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

      const profile = data[0];
      if (!profile) return ctx.notFound("Profile not found");

      return { data: profile, meta: {} };
    },
  }),
);
