//

import { Params } from "@strapi/strapi/lib/services/entity-service";
import { KoaContext, Next } from "~/types";
import { findOneFromUser } from "../services/user-profile";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-profiles/me/contacts",
      handler: "api::user-profile.user-profile.find",
      config: {
        policies: ["global::is-authenticated"],
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
        policies: ["global::is-authenticated"],
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
        policies: ["global::is-authenticated"],
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
    const user = context.state.user;
    const { id } = await findOneFromUser(Number(user.id));
    const { contacts } = await strapi.entityService.findOne(
      "api::user-profile.user-profile",
      id,
      { populate: { contacts: { fields: ["id"] } } },
    );

    const contact_ids = contacts.map(({ id }) => Number(id));
    const query: Params.Pick<"api::user-profile.user-profile", "filters"> = {
      filters: {
        id: { $in: contact_ids },
      },
    };
    context.query.filters = query.filters;
    context.query.populate = {};

    //
    //
    //

    return next();
  };
}
