//

import debug from "debug";
import { register as main_module } from "~/app/(main)/register";
import { root_injector } from "~/core/react";
import { register as exchange_module } from "../register";

//

const log = debug(
  "~:app:(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals:register",
);

export async function register(
  params: any,
  parent = root_injector().createChildContainer(),
) {
  log("start");

  const container = await exchange_module(params, await main_module(parent));

  log("💉");
  return container;
}
