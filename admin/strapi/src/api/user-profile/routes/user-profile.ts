/**
 * user-profile router
 */

import { factories } from "@strapi/strapi";
import { Router } from "@strapi/strapi/lib/types/core-api/router";

// from https://github.com/strapi/documentation/issues/844#issuecomment-1606156227
const coreRouter = factories.createCoreRouter(
  "api::user-profile.user-profile",
) as unknown as Router;

export default {
  get prefix() {
    return coreRouter.prefix;
  },
  get routes() {
    return [
      {
        method: "GET",
        path: "/user-profiles/me",
        handler: "api::user-profile.user-profile.me",
        config: {
          policies: [],
          middlewares: [],
          description: "Get authenticated user profile",
        },
        info: { apiName: "user-profile", type: "content-api" },
      },
      {
        method: "PUT",
        path: "/user-profiles/me",
        handler: "api::user-profile.user-profile.me_update",
        config: {
          policies: [],
          middlewares: [],
          description: "Update authenticated user profile",
        },
        info: { apiName: "user-profile", type: "content-api" },
      },
      ...coreRouter.routes,
    ];
  },
};
