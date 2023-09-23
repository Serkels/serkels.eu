//

import { ID_Schema } from "@1/core/domain";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { injector_session } from "~/core/di";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import {
  Exchange_Route_Provider,
  Route_Container_Provider,
} from "./layout.client";

//

type Route_Params = { params: { exchange_id: string } };

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
  params,
}: PropsWithChildren<Route_Params>) {
  const exchange_id = ID_Schema.parse(params.exchange_id, {
    path: ["params.exchange_id"],
  });

  const container = await injector_session();
  await container.resolve(Get_Exchange_ById_UseCase).prefetch(exchange_id);
  await container
    .resolve(Get_Deals_UseCase)
    .prefetch(exchange_id, { pagination: { pageSize: 6 } });

  //

  return (
    <Nest>
      <Route_Container_Provider
        initialFn={[
          {
            registerInstance: [
              Exchange_Repository.EXCHANGE_ID_TOKEN,
              exchange_id,
            ],
          },
        ]}
        // initialFn={[
        //   {
        //     registerInstance: [
        //       Exchange_Repository.EXCHANGE_ID_TOKEN,
        //       exchange_id,
        //     ],
        //   },
        // ]}
      />

      <Exchange_Route_Provider initialValue={{ exchange_id }} />

      {children}
    </Nest>
  );
}
