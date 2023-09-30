//

import Nest from "react-nest";

import { NextTsyringe } from "@1/next-tsyringe";
import type { InjectionToken } from "tsyringe";
import { Main_Module } from "~/app/(main)/layout";
import { Exchange_Provider } from "../Deal_Provider";
import { Deals_Nav } from "./page.client";

export default async function Page({ params }: { params: any }) {
  const container = await NextTsyringe.injector(Main_Module);
  const exchange_id = container.resolve(
    Symbol.for("ROUTE_EXCHANGE_ID_TOKEN") as InjectionToken<number>,
  );

  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/@nav/page.tsx",
    params,
    exchange_id,
  );
  return (
    <Nest>
      <Exchange_Provider id={exchange_id} />
      <Deals_Nav />
    </Nest>
  );
}
