//

import type { Strapi } from "@strapi/strapi";
import websocket_bootstrap, {
  destroyWSSHandler,
  destroyWss,
} from "./websocket/bootstrap";

//

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }: { strapi: Strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    const { wss, handler } = websocket_bootstrap({ strapi });
    strapi.server.wss_handler = handler;
    strapi.server.wss = wss;
  },
  async destroy({ strapi }: { strapi: Strapi }) {
    await destroyWSSHandler(strapi.server.wss_handler);
    await destroyWss(strapi.server.wss);
  },
};
