//

import "reflect-metadata";

//
// Inspired by https://github.com/microsoft/tsyringe/blob/v4.8.0/src/dependency-container.ts
//
import debug from "debug";
import {
  container,
  type DependencyContainer,
  type InjectionToken,
  type Provider,
  type RegistrationOptions,
} from "tsyringe";
import { NIL, v5 as uuidv5 } from "uuid";

//

const log = debug("~:@1/next-tsyringe:DependencyContainerEx");

//

export interface DependencyContainerEX extends DependencyContainer {
  readonly id: string;
  createNamedChildContainer: (name: string) => DependencyContainerEX;
  registerAll: (registrations?: Registration[]) => DependencyContainerEX;
}

export type Registration = {
  token: InjectionToken;
  options?: RegistrationOptions;
} & Provider;

export const root_container = DependencyContainerEX(container, {
  name: "ROOT",
  namespace: NIL,
});

//

function DependencyContainerEX(
  container: DependencyContainer,
  { name, namespace }: { name: string; namespace: string },
): DependencyContainerEX {
  return Object.assign(container, {
    id: uuidv5(name, namespace),
    register: container.register.bind(container),
    registerAll(registrations: Registration[] = []) {
      for (const { token, options, ...provider } of registrations) {
        log(`⏺️ ${name}`, token, provider, options);
        this.register(token, provider as any, options);
      }
      return this;
    },
    createNamedChildContainer(child_name: string) {
      const child = DependencyContainerEX(container.createChildContainer(), {
        name: child_name,
        namespace: this.id,
      });
      log(`⏫ (${(container as any)?.id})> |${name}| ${child.id}`);
      return child;
    },
  }) as DependencyContainerEX;
}
