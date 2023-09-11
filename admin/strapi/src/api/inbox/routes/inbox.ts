/**
 * inbox router
 */

import { factories } from "@strapi/strapi";
import { set_default_populate } from "../middlewares/set_default_populate";

export default factories.createCoreRouter("api::inbox.inbox", {
  only: ["find", "findOne"],
  config: {
    find: {
      middlewares: [set_default_populate],
    },
    findOne: {
      middlewares: [set_default_populate],
      policies: ["global::is-owned"],
    },
  },
});

//
