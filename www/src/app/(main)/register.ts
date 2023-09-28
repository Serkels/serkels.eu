//

import { ID_Schema, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import debug from "debug";
import { z } from "zod";
import { root_injector } from "~/core/di";
import { get_api_session } from "../api/auth/[...nextauth]/route";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";

//

const log = debug("~:app:(main):register");

export async function register(
  container = root_injector().createChildContainer(),
) {
  log("start");

  const session = await get_api_session();

  const profile_id =
    ID_Schema.optional().parse(session?.user?.profile.id, {
      path: ["session?.user?.profile.id"],
    }) ?? NaN;

  const jwt = z
    .string()
    .default("")
    .parse(session?.user?.jwt, {
      path: ["session.user?.jwt"],
    });

  container.registerInstance(JWT_TOKEN, jwt);
  container.registerInstance(USER_PROFILE_ID_TOKEN, profile_id);

  log("💉");
  return container;
}
