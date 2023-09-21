/**
 * exchange-deal router
 */

import { factories } from "@strapi/strapi";
import { create_deal_body } from "../middlewares/create_deal_body";
import { filter_by_user_id } from "../middlewares/filter_by_user_id";

export default factories.createCoreRouter("api::exchange-deal.exchange-deal", {
  config: {
    create: {
      middlewares: [create_deal_body],
      policies: [],
    },
    find: { middlewares: [filter_by_user_id] },
    findOne: {
      policies: ["global::blocked"],
    },
    update: {
      policies: ["global::blocked"],
    },
  },
});
