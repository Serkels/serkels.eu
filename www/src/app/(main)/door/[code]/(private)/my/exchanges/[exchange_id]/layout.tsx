//

import { Id } from "@1/core/domain";
import { NextTsyringe } from "@1/next-tsyringe";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import type { InjectionToken } from "tsyringe";
import { Main_Module } from "~/app/(main)/layout";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Exchange_Route_Provider } from "./layout.client";

//

const ROUTE_EXCHANGE_ID_TOKEN = Symbol.for(
  "ROUTE_EXCHANGE_ID_TOKEN",
) as InjectionToken<number>;
export type Route_Params = { params: { exchange_id: string } };

export async function generateMetadata(
  { params }: Route_Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Exchange@${params.exchange_id} :: ${(await parent).title
      ?.absolute}`,
  };
}

//

export default async function Layout({
  children,
}: PropsWithChildren<Route_Params>) {
  const container = await NextTsyringe.injector(Main_Module);

  const exchange_id = container.resolve(ROUTE_EXCHANGE_ID_TOKEN);
  await container.resolve(Get_Exchange_ById_UseCase).prefetch(Id(exchange_id));
  await container
    .resolve(Get_Deals_UseCase)
    .prefetch(exchange_id, { pagination: { pageSize: 6 } });

  console.log(
    "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/layout.tsx",
    { exchange_id },
  );

  //

  return (
    <Nest>
      {/* <Hydrate_Container_Provider
        registerAll={[
          {
            registerInstance: [
              Exchange_Repository.EXCHANGE_ID_TOKEN,
              exchange_id,
            ],
          },
          {
            registerInstance: [ROUTE_EXCHANGE_ID_TOKEN, exchange_id],
          },
        ]}
      /> */}

      <Exchange_Route_Provider initialValue={{ exchange_id }} />

      {children}
    </Nest>
  );
}
