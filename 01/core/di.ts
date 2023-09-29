//

import debug from "debug";
import "reflect-metadata";
import { Id, type UID } from "rich-domain";
import { container, type DependencyContainer } from "tsyringe";

//

const log = debug("~:core:di");

//

export {
  Lifecycle,
  inject,
  registry,
  scoped,
  type DependencyContainer,
  type InjectionToken,
} from "tsyringe";
export { root_container };

export type DependencyContainerEntry = DependencyContainer & {
  id: UID;
};

export function createChildContainer(
  parent: DependencyContainerEntry,
): DependencyContainerEntry {
  const child = parent.createChildContainer() as DependencyContainerEntry;
  child.id = Id();

  log(`💉 ${child.id.value()} (${parent?.id.value()})`);
  return child;
}

const root_container =
  container.createChildContainer() as DependencyContainerEntry;
root_container.id = Id("root");
