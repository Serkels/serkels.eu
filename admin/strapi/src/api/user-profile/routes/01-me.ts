//

import { KoaContext, Next } from "~/types";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-profiles/me/contacts",
      handler: "api::user-profile.user-profile.find",
      config: {
        policies: [],
        middlewares: [
          find_in_owner_contact(),
          //
          //
          //
        ],
        description: "Get contacts user profiles",
      },
      info: { apiName: "user-profile", type: "content-api" },
    },
    {
      method: "GET",
      path: "/user-profiles/me",
      handler: "api::user-profile.me.find",
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
      handler: "api::user-profile.me.update",
      config: {
        policies: [],
        middlewares: [],
        description: "Update authenticated user profile",
      },
      info: { apiName: "user-profile", type: "content-api" },
    },
  ],
};

//

function find_in_owner_contact() {
  return async function find(context: KoaContext, next: Next) {
    context.query.filters = {
      id: [],
    };
    context.query.populate = {};

    //
    //
    //

    return next();
  };
}
