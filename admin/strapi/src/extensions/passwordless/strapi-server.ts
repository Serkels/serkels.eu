//

import { HandlerConfig, Route } from "@strapi/strapi/lib/types/core-api/router";
import email_check from "./policies/email_check";

export default (plugin) => {
  const routes: Route[] = plugin?.routes["content-api"]?.routes;

  if (!routes) {
    strapi.log.warn(
      `extensions/passwordless/strapi-server.ts requires content-api routes`,
    );
    return plugin;
  }

  const sendLink = routes.find(({ path }) => path === "/send-link");
  if (!sendLink) {
    strapi.log.warn(
      `extensions/passwordless/strapi-server.ts requires sendLink route`,
    );
    return plugin;
  }

  plugin.policies["email_check"] = email_check;

  const config: HandlerConfig = (sendLink["config"] = sendLink["config"] ?? {});
  config.policies = config.policies ?? [];
  config.policies.push("plugin::passwordless.email_check");

  return plugin;
};
