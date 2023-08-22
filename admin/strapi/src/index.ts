//

import { register as fix_esm } from "fix-esm";
import { resolve } from "path";
import { register as tsconfig_paths } from "tsconfig-paths";
import tsConfig from "../tsconfig.json";

tsconfig_paths({
  baseUrl: resolve(__dirname, "../"),
  paths: tsConfig.compilerOptions.paths,
});
fix_esm();

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
