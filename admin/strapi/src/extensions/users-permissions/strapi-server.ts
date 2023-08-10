//

import { HandlerConfig, Route } from "@strapi/strapi/lib/types/core-api/router";

export default (plugin) => {
  const routes: Route[] = plugin?.routes["content-api"]?.routes;

  if (!routes) {
    strapi.log.warn(
      `extensions/users-permissions/strapi-server.ts requires content-api routes`,
    );
    return plugin;
  }

  plugin.policies["nope"] = () => false;
  for (const route of routes) {
    const config: HandlerConfig = (route["config"] = route["config"] ?? {});
    config.policies = config.policies ?? [];
    config.policies.push("plugin::users-permissions.nope");
  }

  return plugin;
};
