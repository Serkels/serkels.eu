//

import { Strapi } from "@strapi/strapi";
import { pluginId } from "strapi-plugin-comments/admin/src/pluginId";
import lifecycles from "./content-types/comment/lifecycles";

const COMMENT_CONTENT_TYPE = "comment";
export default (plugin) => {
  const super_bootstrap = plugin.bootstrap;

  plugin.bootstrap = async (ctx: { strapi: Strapi }) => {
    super_bootstrap(ctx);

    //

    const { strapi } = ctx;

    strapi.db.lifecycles.subscribe({
      models: [`plugin::${pluginId}.${COMMENT_CONTENT_TYPE}`],
      ...lifecycles,
    } as any);
  };

  return plugin;
};
