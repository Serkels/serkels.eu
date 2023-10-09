//

import "reflect-metadata";

//

export {
  Container_Provider,
  create_container_provider,
} from "./Container_Provider";
export {
  DefaultProvider,
  NextTsyringe,
  type LayoutModuleLike,
  type NextTsyringeRegister,
  type RegistrationFn,
} from "./NextTsyringe.decorator";
export { ContainerContext, useContainer, useInject } from "./context";
export { root_container } from "./dependency-container";
export type {
  DependencyContainerEX,
  Registration,
} from "./dependency-container";
