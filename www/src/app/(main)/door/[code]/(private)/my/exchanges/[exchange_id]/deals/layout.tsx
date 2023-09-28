//

import { Id } from "@1/core/domain";
import { Exchange } from "@1/modules/exchange/domain";
import { Exchange_Record } from "@1/modules/exchange/infra/strapi";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
import { z } from "zod";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { ROUTE_EXCHANGE_ID_TOKEN } from "../register";
import { Deal_Route_Provider, Deals_Aside_Nav } from "./layout.client";
import { register } from "./register";

//

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: any }>) {
  return (
    <Nest>
      <Deal_Route_Provider />
      {/* <Exchange_ValueProvider /> */}
      <Aside params={params} />

      {/* */}

      {children}
    </Nest>
    // <Deal_Route_Provider>
    //   <Deals_Aside_Nav>
    //     <MyDeals />
    //   </Deals_Aside_Nav>
    //   {children}
    // </Deal_Route_Provider>
  );
}

async function Aside(props: any) {
  const { diviser, header, title } = aside();

  try {
    const container = await register(props);

    const id = container.resolve(ROUTE_EXCHANGE_ID_TOKEN);
    const query_client = await container
      .resolve(Get_Exchange_ById_UseCase)
      .prefetch(Id(id));

    const data = query_client.getQueryData(Exchange_QueryKeys.item(id));
    const exchange = Exchange_Record.pipe(z.instanceof(Exchange)).parse(data, {
      path: [`<query_client.getQueryData(Exchange_QueryKeys.item(${id}))>`],
    });

    return (
      <Deals_Aside_Nav>
        <header className={header()}>
          <h6 className={title()}>{exchange.title}</h6>
        </header>
        <hr className={diviser()} />
      </Deals_Aside_Nav>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

const aside = tv({
  slots: {
    diviser: "my-6 border-2 border-[#F0F0F0] ",
    header: "mt-6 flex h-16 items-center justify-start space-x-7",
    title: "line-clamp-2 flex-1 text-xl font-bold",
  },
});
