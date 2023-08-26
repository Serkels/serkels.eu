/**
 * exchange-deal router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::exchange-deal.exchange-deal", {
  only: ["create"],
  config: {},
});
