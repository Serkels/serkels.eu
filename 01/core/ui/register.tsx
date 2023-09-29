// "use client";

import debug from "debug";
import type {
  DependencyContainer,
  InjectionToken,
  Provider,
  RegistrationOptions,
} from "tsyringe";

//

const log = debug("~:core:di");

//
export function register(
  registrations: ({
    token: InjectionToken;
    options?: RegistrationOptions;
  } & Provider<any>)[] = [],
  parent: DependencyContainer,
) {
  const container = parent.createChildContainer();
  for (const { token, options, ...provider } of registrations) {
    log(token, provider as any, options);
    container.register(token, provider as any, options);
  }
  return container;
}

export type Registrations = Parameters<typeof register>[0];
