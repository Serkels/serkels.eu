//

import { AuthError, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import { cache } from "react";
import "reflect-metadata";
import { container } from "tsyringe";
import { get_api_session } from "~/app/api/auth/[...nextauth]/route";
import { fromServer } from "~/app/api/v1";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";

//

export {
  Lifecycle,
  container,
  inject,
  scoped,
  type DependencyContainer,
  type InjectionToken,
} from "tsyringe";

export const injector = cache(() => {
  const root_container = container.createChildContainer();
  root_container.registerInstance(JWT_TOKEN, "");
  root_container.registerInstance(API_TOKEN, fromServer);
  root_container.registerInstance(USER_PROFILE_ID_TOKEN, NaN);
  return root_container;
});

export async function injector_session(parent_container = injector()) {
  const session = await get_api_session();
  if (!session) {
    throw new AuthError("Unauthenticated");
  }

  const container = parent_container.createChildContainer();
  container.registerInstance(JWT_TOKEN, session.user?.jwt);
  container.registerInstance(USER_PROFILE_ID_TOKEN, session.user?.profile.id);
  return container;
}

//
