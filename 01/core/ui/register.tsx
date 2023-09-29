// "use client";

import debug from "debug";
import type { InjectionToken, Provider, RegistrationOptions } from "tsyringe";
import { createChildContainer, type DependencyContainerEntry } from "../di";

//

const log = debug("~:core:register");

//

export function register_branch(
  registrations: ({
    token: InjectionToken;
    options?: RegistrationOptions;
  } & Provider<any>)[] = [],
  parent: DependencyContainerEntry,
) {
  const container = createChildContainer(parent);
  for (const { token, options, ...provider } of registrations) {
    log("⏺️", token, provider, options);
    container.register(token, provider as any, options);
  }
  return container;
}

export type Registrations = Parameters<typeof register_branch>[0];
