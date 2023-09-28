//

import { AuthError, USER_PROFILE_ID_TOKEN, UnknownError } from "@1/core/domain";
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
  console.trace();
  const root = root_injector();

  let nope: () => void = () => {
    throw new UnknownError("O_0");
  };
  let ready = nope;
  let infinit_wait = new Promise<void>((resolve) => {
    log("getInjector>infinit_wait");
    ready = resolve;
    console.log("! new ready", ready);
  });
  console.log("! new infinit_wait");

  return {
    container: root,
    start: Promise.resolve(),
    last_layout_ready() {
      ready();
    },
    registeries: [] as Promise<void>[],
    async ready() {
      console.log("! ready");

      await Promise.all([...this.registeries]);
      ready();

      this.registeries = [];
      infinit_wait = Promise.resolve();
      ready = nope;
      console.log("! infinit_wait = Promise.resolve()");
    },
    is_ready() {
      // console.trace();
      // console.log(infinit_wait);
      log("waiting_for", this.registeries.length);
      return Promise.all([infinit_wait, ...this.registeries]);
    },
  };
});

export const setInjector = cache((container: DependencyContainer) => {
  log("setInjector");
  getInjector().container = container;
  return container;
});
export const childInjector = (
  register_callback: (container: DependencyContainer) => Promise<void>,
  parent = getInjector().container,
) => {
  const { registeries } = getInjector();
  log("childInjector");
  const child = parent.createChildContainer();
  registeries.push(register_callback(child));
  return setInjector(child);
};

export const injector = cache(async () => {
  log("injector");
  await getInjector().is_ready();
  log("injector", "is_ready");
  return getInjector().container;
});

//
