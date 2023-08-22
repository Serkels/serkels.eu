//

require("fix-esm").register();

//

import type { Strapi } from "@strapi/strapi";
import websocket_bootstrap, {
  destroyWSSHandler,
  destroyWss,
} from "./websocket/bootstrap";

//

export default {
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
