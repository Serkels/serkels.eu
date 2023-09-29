//

import { ID_Schema } from "@1/core/domain";
import debug from "debug";
import type { InjectionToken } from "tsyringe";
import { register as main_module } from "~/app/(main)/register";
import { root_injector } from "~/core/react";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";
import type { Route_Params } from "./layout";

//

const log = debug(
  "~:app:(main)/door/[code]/(private)/my/exchanges/[exchange_id]:register",
);

export const ROUTE_EXCHANGE_ID_TOKEN = Symbol.for(
  "ROUTE_EXCHANGE_ID_TOKEN",
) as InjectionToken<number>;

export async function register(
  { params }: Route_Params,
  parent = root_injector().createChildContainer(),
) {
  log("start");
  const container = await main_module(parent);

  const exchange_id = ID_Schema.parse(params.exchange_id, {
    path: ["params.exchange_id"],
  });

  container.registerInstance(ROUTE_EXCHANGE_ID_TOKEN, exchange_id);
  container.registerInstance(
    Exchange_Repository.EXCHANGE_ID_TOKEN,
    exchange_id,
  );

  log("💉");
  return container;
}
