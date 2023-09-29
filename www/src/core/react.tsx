//

import { container, type InjectionToken } from "@1/core/di";
import { AuthError, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import debug from "debug";
import { cache, type PropsWithChildren } from "react";
import { get_api_session } from "~/app/api/auth/[...nextauth]/route";
import { fromServer } from "~/app/api/v1";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { Hydrate_Container_Provider } from "./react.client";

//
//
//

const log = debug("~:core:react");

/**
 * @deprecated use {@link Hydrate_Container_Provider}
 */
export async function Container_Provider({
  children,
  registerAll,
}: PropsWithChildren<{
  registerAll: { registerInstance?: [InjectionToken<unknown>, unknown] }[];
}>) {
  log("🌲");

  return (
    <Hydrate_Container_Provider registerAll={registerAll}>
      {children}
    </Hydrate_Container_Provider>
  );
}

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
export const injector = () => getInjector().container;
export const getInjector = cache(() => {
  const root = root_injector();

  return {
    container: root,
  };
});
