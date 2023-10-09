// "use client";

import debug from "debug";
import type { InjectionToken, Provider, RegistrationOptions } from "tsyringe";
import { createChildContainer, type DependencyContainerEntry } from "../di";

//

const log = debug("~:core:register");

//

export type Registration = {
  token: InjectionToken;
  options?: RegistrationOptions;
} & Provider;

export function register_branch(
  registrations: Registration[] = [],
  parent: DependencyContainerEntry,
) {
  const container = createChildContainer(parent);
  for (const { token, options, ...provider } of registrations) {
    log("⏺️", token, provider, options);
    container.register(token, provider as any, options);
  }
  return container;
}

/**
 * @deprecated use Registration[]
 */
export type Registrations = Parameters<typeof register_branch>[0];
