//

import { Id } from "@1/core/domain";
import { Exchange } from "@1/modules/exchange/domain";
import { Exchange_Record } from "@1/modules/exchange/infra/strapi";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
import { z } from "zod";
import { injector_session } from "~/core/react";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { Deal_Route_Provider, Deals_Aside_Nav } from "./layout.client";

//

export default function Layout({
  children,
  nav,
  params,
}: PropsWithChildren<{ params: any; nav: React.ReactNode }>) {
  return (
    <Nest>
      <Deal_Route_Provider />
      {/* <Exchange_ValueProvider /> */}
      <Aside params={params} nav={nav} />

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

async function Aside({ params, nav }: { params: any; nav: React.ReactNode }) {
  const { diviser, header, title } = aside();

  try {
    const container = await injector_session();
    const id = params["exchange_id"];
    const query_client = await container
      .resolve(Get_Exchange_ById_UseCase)
      .prefetch(Id(id));

    const data = query_client.getQueryData(
      Exchange_QueryKeys.item(Id(id).value()),
    );
    const exchange = Exchange_Record.pipe(z.instanceof(Exchange)).parse(
      { data },
      {
        path: [`<query_client.getQueryData(Exchange_QueryKeys.item(${id}))>`],
      },
    );

    console.log(
      "src/app/(main)/door/[code]/(private)/my/exchanges/[exchange_id]/deals/layout.tsx",
      { id },
    );

    return (
      <Deals_Aside_Nav>
        <header className={header()}>
          <h6 className={title()}>{exchange.title}</h6>
        </header>
        <hr className={diviser()} />
        {nav}
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
