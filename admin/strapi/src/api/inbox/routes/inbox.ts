/**
 * inbox router
 */

import { factories } from "@strapi/strapi";
import { set_default_populate } from "../middlewares/set_default_populate";

export default factories.createCoreRouter("api::inbox.inbox", {
  only: ["find", "findOne"],
  config: {
    find: {
      middlewares: [
        set_default_populate, // "api::inbox.set_default_populate",
        "global::filter-by-owner",
      ],
    },
    findOne: {
      middlewares: [
        set_default_populate, // "api::inbox.set_default_populate",
        "global::filter-by-owner",
      ],
    },
  },
});

//
