//

import { AuthError, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import debug from "debug";
import { cache } from "react";
import "reflect-metadata";
import { container, type DependencyContainer } from "tsyringe";
import { get_api_session } from "~/app/api/auth/[...nextauth]/route";
import { fromServer } from "~/app/api/v1";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";

//

export {
  Lifecycle,
  container,
  inject,
  registry,
  scoped,
  type DependencyContainer,
  type InjectionToken,
} from "tsyringe";

const log = debug("~:core:di");

export const root_injector = cache(() => {
  log("root_injector");
  const root_container = container.createChildContainer();
  root_container.registerInstance(JWT_TOKEN, "");
  root_container.registerInstance(API_TOKEN, fromServer);
  root_container.registerInstance(USER_PROFILE_ID_TOKEN, NaN);
  return root_container;
});

export async function injector_session(root = getInjector()) {
  log("injector_session");
  const session = await get_api_session();
  if (!session) {
    throw new AuthError("Unauthenticated");
  }

  const container = (root.container = root.container.createChildContainer());
  container.registerInstance(JWT_TOKEN, session.user?.jwt);
  container.registerInstance(USER_PROFILE_ID_TOKEN, session.user?.profile.id);

  return container;
}

export const getInjector = cache(() => {
  const root = root_injector();

  return {
    container: root,
  };
});

export const setInjector = cache((container: DependencyContainer) => {
  log("setInjector");
  getInjector().container = container;
  return container;
});

export const injector = () => getInjector().container;

//
