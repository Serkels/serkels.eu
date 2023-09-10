//

import { cache } from "react";
import "reflect-metadata";
import { container } from "tsyringe";
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
  return root_container;
});

//
