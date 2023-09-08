//

import { HandlerConfig, Route } from "@strapi/strapi/lib/types/core-api/router";
import { create_user_middleware } from "./middlewares/create_user";
import email_check from "./policies/email_check";

//

export default (plugin) => {
  plugin.policies["email_check"] = email_check;

  const routes: Route[] = plugin?.routes["content-api"]?.routes;

  if (!routes) {
    strapi.log.warn(`protected_send_link_route :: requires content-api routes`);
    return plugin;
  }

  protected_send_link_route(routes);

  sigup_role_middleware(routes);

  return plugin;
};

//

function protected_send_link_route(routes: Route[]) {
  const send_link = routes.find(({ path }) => path === "/send-link");
  if (!send_link) {
    strapi.log.warn(`protected_send_link_route :: requires /send-link route`);
    return;
  }

  const config: HandlerConfig = (send_link["config"] =
    send_link["config"] ?? {});
  config.policies = config.policies ?? [];
  config.policies.push("plugin::passwordless.email_check");
}

function sigup_role_middleware(routes: Route[]) {
  const send_link = routes.find(({ path }) => path === "/send-link");
  if (!send_link) {
    strapi.log.warn(`protected_send_link_route :: requires /send-link route`);
    return;
  }

  const config: HandlerConfig = (send_link["config"] =
    send_link["config"] ?? {});
  config.middlewares = config.middlewares ?? [];
  config.middlewares.push(create_user_middleware());
}
